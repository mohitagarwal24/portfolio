import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
const origin = process.env.TEST_URL ?? "http://localhost:3000";
const out = "artifacts/verification";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (message) => {
  if (
    message.type() === "error" &&
    /hydrat|server rendered HTML/i.test(message.text())
  )
    errors.push(message.text());
});
const results = [];
const check = async (name, fn) => {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, passed: false, error: e.message });
    console.error("FAIL", name, e.message);
  } finally {
    await close();
  }
};
const instant = async (selector) => {
  await page.evaluate(
    (selector) =>
      scrollTo({
        top:
          document.querySelector(selector).getBoundingClientRect().top +
          scrollY -
          100,
        behavior: "instant",
      }),
    selector,
  );
  await page.waitForTimeout(100);
};
const close = async () => {
  if (await page.locator("dialog[open]").count()) {
    await page.keyboard.press("Escape");
    await page.locator("dialog[open]").waitFor({ state: "hidden" });
  }
};
try {
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  await check(
    "Reference structure, fonts, images and public content",
    async () => {
      assert.equal(await page.locator("h1").innerText(), "Mohit\nAgarwal");
      assert.equal(await page.locator(".proof-panel").count(), 4);
      assert.equal(await page.locator(".featured-project").count(), 6);
      assert.equal(await page.locator(".archive-project").count(), 9);
      assert.equal(await page.locator(".project-pill").count(), 12);
      const obscuredPills = await page
        .locator(".project-pill")
        .evaluateAll((els) =>
          els
            .filter((el) => {
              const box = el.getBoundingClientRect();
              const target = document.elementFromPoint(
                box.x + box.width / 2,
                box.y + box.height / 2,
              );
              return target?.closest(".project-pill") !== el;
            })
            .map((el) => el.getAttribute("aria-label")),
        );
      assert.deepEqual(
        obscuredPills,
        [],
        "Every settled hero pill has an exposed center",
      );
      assert.equal(
        await page.locator(".particle-stage").getAttribute("data-ready"),
        "true",
      );
      assert.equal(
        await page.locator(".project-playground").getAttribute("data-physics"),
        "true",
      );
      assert.match(
        await page
          .locator(".huge-heading")
          .first()
          .evaluate((e) => getComputedStyle(e).fontFamily),
        /Archivo/,
      );
      assert.equal(
        await page.evaluate(
          () => getComputedStyle(document.body).backgroundColor,
        ),
        "rgb(240, 232, 218)",
      );
      assert.equal(
        await page.locator(".resume-link").getAttribute("href"),
        "/resume/mohit-agarwal.pdf",
      );
      const pdf = await context.request.get(
        `${origin}/resume/mohit-agarwal.pdf`,
      );
      assert.equal(pdf.status(), 200);
      assert.equal((await pdf.body()).subarray(0, 5).toString(), "%PDF-");
      assert.equal(
        await page.locator('link[rel="canonical"]').getAttribute("href"),
        "https://www.maddiee.dev",
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
    },
  );
  await check(
    "Build Lab preview, project navigation, keyboard build and reset",
    async () => {
      await page
        .getByRole("button", { name: "Try Build Lab", exact: true })
        .click();
      await page.locator('.build-lab[data-state="ready"]').waitFor();
      await page.locator(".build-open").click();
      assert.match(
        await page.locator("#project-title").innerText(),
        /GitCraft/i,
      );
      await close();
      await page.getByRole("button", { name: "Reset playground" }).click();
      assert.equal(
        await page.locator(".build-lab").getAttribute("data-state"),
        "idle",
      );
      await page.locator(".project-pill").nth(1).focus();
      await page.keyboard.press("b");
      await page.locator('.build-lab[data-state="ready"]').waitFor();
      assert.match(await page.locator(".build-open").innerText(), /TradeLayer/);
      await page.locator(".build-open").click();
      assert.match(
        await page.locator("#project-title").innerText(),
        /TradeLayer/i,
      );
      await close();
      await page.getByRole("button", { name: "Reset playground" }).click();
    },
  );
  await check(
    "A project dropped from above is absorbed and reset restores it",
    async () => {
      await page.waitForTimeout(2200);
      const pill = page.locator(".project-pill").first();
      await pill.focus();
      const box = await pill.boundingBox();
      const intake = await page.locator(".build-intake").boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(intake.x + intake.width / 2, intake.y - 85, {
        steps: 18,
      });
      await page.waitForTimeout(150);
      await page.mouse.up();
      await page.waitForFunction(
        () =>
          document.querySelector(".project-pill")?.dataset.absorbing === "true",
      );
      assert.equal(
        await page.locator(".build-lab").getAttribute("data-state"),
        "building",
      );
      await pill.waitFor({ state: "hidden" });
      await page.locator('.build-lab[data-state="ready"]').waitFor();
      assert.match(await page.locator(".build-open").innerText(), /GitCraft/);
      assert.equal(await page.locator("dialog[open]").count(), 0);
      assert.equal(await page.locator(".build-dock").count(), 0);
      assert.equal(
        await page.getByText("Drop a project.", { exact: true }).count(),
        0,
      );
      await page.getByRole("button", { name: "Reset playground" }).click();
      await pill.waitFor({ state: "visible" });
      assert.equal(await pill.getAttribute("data-absorbing"), null);
    },
  );
  await check(
    "Skill circles fall after being dragged and released",
    async () => {
      const circle = page.locator(".category-pill").first();
      await circle.focus();
      const box = await circle.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(250, 310, { steps: 16 });
      await page.waitForTimeout(1200);
      const held = await circle.boundingBox();
      await page.mouse.up();
      await page.waitForFunction(
        (top) =>
          document.querySelector(".category-pill").getBoundingClientRect().top >
          top + 35,
        held.y,
      );
      const fallen = await circle.boundingBox();
      assert.ok(
        fallen.y > held.y + 35,
        "Released skill circle responds to gravity",
      );
      await page.getByRole("button", { name: "Reset playground" }).click();
    },
  );
  await check(
    "Grammarly body attributes do not produce hydration warnings",
    async () => {
      const extensionContext = await browser.newContext();
      await extensionContext.addInitScript(() => {
        const inject = () => {
          if (!document.body) return false;
          document.body.setAttribute(
            "data-new-gr-c-s-check-loaded",
            "14.1339.0",
          );
          document.body.setAttribute("data-gr-ext-installed", "");
          return true;
        };
        if (!inject()) {
          const observer = new MutationObserver(() => {
            if (inject()) observer.disconnect();
          });
          observer.observe(document, { childList: true, subtree: true });
        }
      });
      const extensionPage = await extensionContext.newPage();
      const hydrationErrors = [];
      extensionPage.on("console", (message) => {
        if (
          message.type() === "error" &&
          /hydrat|server rendered HTML/i.test(message.text())
        )
          hydrationErrors.push(message.text());
      });
      extensionPage.on("pageerror", (e) => hydrationErrors.push(e.message));
      await extensionPage.goto(process.env.HYDRATION_TEST_URL ?? origin, {
        waitUntil: "networkidle",
      });
      await extensionPage
        .locator('.particle-stage[data-ready="true"]')
        .waitFor();
      assert.equal(
        await extensionPage
          .locator("body")
          .getAttribute("data-gr-ext-installed"),
        "",
      );
      await extensionPage
        .getByRole("button", { name: "HI", exact: true })
        .click();
      assert.equal(
        await extensionPage
          .getByRole("button", { name: "HI", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      assert.deepEqual(hydrationErrors, []);
      await extensionContext.close();
    },
  );
  await check("Pointer drag moves a project without opening it", async () => {
    await page.waitForTimeout(2500);
    const pill = page.locator(".project-pill").first();
    const box = await pill.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 110, box.y - 130, {
      steps: 12,
    });
    await page.waitForTimeout(80);
    const moved = await pill.boundingBox();
    assert.ok(moved.y < box.y - 70);
    await page.mouse.up();
    assert.equal(await page.locator("dialog[open]").count(), 0);
  });
  await check(
    "Every isometric layer and secondary selector works",
    async () => {
      await instant("#skills");
      for (const name of [
        "Leadership",
        "Full-stack",
        "AI & ML",
        "Systems",
        "Data & quant",
        "Web3",
      ]) {
        const tab = page.getByRole("tab", { name, exact: true });
        await tab.locator("span").click();
        assert.equal(await tab.getAttribute("aria-selected"), "true");
        assert.match(
          await page.getByRole("tabpanel").innerText(),
          new RegExp(name, "i"),
        );
      }
      await page
        .locator(".skill-selectors")
        .getByRole("button", { name: "Leadership", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("tab", { name: "Leadership", exact: true })
          .getAttribute("aria-selected"),
        "true",
      );
    },
  );
  await check("Skill stack arrow, Home and End keys", async () => {
    const tab = page.getByRole("tab", { name: "Leadership", exact: true });
    await tab.focus();
    await page.keyboard.press("End");
    assert.equal(
      await page
        .getByRole("tab", { name: "Web3", exact: true })
        .getAttribute("aria-selected"),
      "true",
    );
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowDown");
    assert.equal(
      await page
        .getByRole("tab", { name: "Full-stack", exact: true })
        .getAttribute("aria-selected"),
      "true",
    );
  });
  await check("All archive filters match real project counts", async () => {
    await instant("#all-projects");
    for (const button of await page.locator(".filter-list button").all()) {
      const count = Number(await button.locator("span").innerText());
      assert.ok(count > 0, "Archive filters must contain projects");
      await button.click();
      assert.equal(await page.locator(".archive-project").count(), count);
    }
    await page.locator(".filter-list button").first().click();
  });
  await check("All 15 project reports, links and Escape", async () => {
    for (const slug of [
      "gitcraft",
      "tradelayer",
      "llm-tracing",
      "nifty-intelligence",
      "citadel",
      "resq",
      "option-pricing",
      "sentioasis",
      "smallcase-defi",
      "chainlance",
      "nexus",
      "satellite-valuation",
      "sequence-recognition",
      "synapse",
      "sicxe-assembler",
    ]) {
      await page.evaluate((slug) => {
        location.hash = `project-${slug}`;
      }, slug);
      await page.waitForFunction(
        (slug) =>
          document.querySelector(".project-dialog")?.dataset.project === slug,
        slug,
      );
      assert.ok(
        (await page.locator(".project-report").innerText()).length > 50,
      );
      assert.match(page.url(), new RegExp(`#project-${slug}`));
      await close();
    }
  });
  await check("Project dialog traps scrolling and restores focus", async () => {
    await instant(".project-stack");
    const trigger = page
      .locator(".featured-project")
      .first()
      .getByRole("button", { name: "Explore project ↗", exact: true });
    await trigger.click();
    await page.getByRole("dialog").waitFor({ state: "visible" });
    const y = await page.evaluate(() => scrollY);
    await page.mouse.move(2, 500);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => scrollY), y);
    await close();
    assert.equal(
      await trigger.evaluate((e) => document.activeElement === e),
      true,
    );
  });
  await check(
    "About contains verified education, future internship and seven merged contributions",
    async () => {
      await page.evaluate(() => {
        location.hash = "about";
      });
      await page.locator(".about-dialog").waitFor({ state: "visible" });
      assert.match(await page.locator(".about-dialog").innerText(), /9.31/);
      assert.match(
        await page.locator(".incoming-note").innerText(),
        /Summer 2027/,
      );
      assert.match(
        await page.locator(".about-dialog").innerText(),
        /Seven merged contributions/,
      );
      await close();
    },
  );
  await check("Command navigation finds projects and sections", async () => {
    await page.keyboard.press("Control+k");
    await page.locator(".quick-dialog").waitFor({ state: "visible" });
    await page
      .getByRole("textbox", { name: "Search sections and projects" })
      .fill("tradelayer");
    await page.keyboard.press("Enter");
    await page.locator(".project-dialog").waitFor({ state: "visible" });
    assert.match(
      await page.locator("#project-title").innerText(),
      /TradeLayer/i,
    );
    assert.match(
      await page.locator(".project-note").innerText(),
      /local enclave simulation/,
    );
    await close();
  });
  await check(
    "Contact selections, editable draft and real mailto destination",
    async () => {
      await instant("#contact");
      await page.getByRole("button", { name: "A system", exact: true }).click();
      await page
        .getByRole("button", { name: "In 1–3 months", exact: true })
        .click();
      assert.match(
        await page
          .getByRole("textbox", { name: "Your message to Mohit" })
          .inputValue(),
        /a system/,
      );
      let href = decodeURIComponent(
        await page
          .getByRole("link", { name: "Send an email" })
          .getAttribute("href"),
      );
      assert.match(href, /mailto:contact@maddiee.dev/);
      assert.match(href, /1–3 months/);
      await page
        .getByRole("textbox", { name: "Your message to Mohit" })
        .fill("Hi Mohit, a custom project brief.");
      href = decodeURIComponent(
        await page
          .getByRole("link", { name: "Send an email" })
          .getAttribute("href"),
      );
      assert.match(href, /a custom project brief/);
    },
  );
  await check("EN/HI core interface switch", async () => {
    await page.evaluate(() => scrollBy({ top: -100, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "HI", exact: true }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "HI", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.match(await page.locator(".site-header").innerText(), /संपर्क/);
    await page.getByRole("button", { name: "EN", exact: true }).click();
  });
  await check(
    "Deep links reload, legacy redirects and unknown routes",
    async () => {
      await page.goto(`${origin}/#project-llm-tracing`, {
        waitUntil: "networkidle",
      });
      await page.locator(".project-dialog").waitFor({ state: "visible" });
      assert.match(await page.locator("#project-title").innerText(), /LLM/);
      await close();
      for (const [path, hash] of [
        ["/work", "#work"],
        ["/about", "#about"],
        ["/work/gitcraft", "#project-gitcraft"],
      ]) {
        const r = await context.request.get(origin + path, { maxRedirects: 0 });
        assert.equal(r.status(), 308);
        assert.equal(r.headers().location, "/" + hash);
      }
      for (const path of ["/work/no-such-project", "/logs", "/not-a-page"])
        assert.equal((await context.request.get(origin + path)).status(), 404);
    },
  );
  for (const state of ["desktop", "project", "about"])
    await check(`${state} automated WCAG 2.2 A/AA`, async () => {
      await close();
      if (state !== "desktop")
        await page.evaluate((state) => {
          location.hash = state === "about" ? "about" : "project-gitcraft";
        }, state);
      if (state !== "desktop")
        await page.getByRole("dialog").waitFor({ state: "visible" });
      const a = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      await writeFile(
        `${out}/axe-${state}.json`,
        JSON.stringify(a.violations, null, 2),
      );
      assert.deepEqual(
        a.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
        [],
      );
      await close();
    });
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/reference-desktop.png` });
  await check(
    "Mobile and tablet geometry, all pills, skills and dialogs",
    async () => {
      for (const width of [320, 390, 768, 1024]) {
        await page.setViewportSize({ width, height: 900 });
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          `overflow at ${width}`,
        );
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(
        await page.locator(".project-playground").getAttribute("data-physics"),
        "false",
      );
      const boxes = await page.locator(".project-pill").evaluateAll((es) =>
        es.map((e) => ({
          y: e.getBoundingClientRect().top,
          bottom: e.getBoundingClientRect().bottom,
        })),
      );
      const heroBottom = await page
        .locator(".hero")
        .evaluate((e) => e.getBoundingClientRect().bottom);
      assert.ok(
        boxes.every((b) => b.y >= 0 && b.bottom <= heroBottom),
        "all pills fit in mobile hero",
      );
      await instant("#skills");
      await page
        .getByRole("tab", { name: "Systems", exact: true })
        .locator("span")
        .click();
      assert.equal(
        await page
          .getByRole("tab", { name: "Systems", exact: true })
          .getAttribute("aria-selected"),
        "true",
      );
      await instant(".project-stack");
      await page
        .locator(".featured-project")
        .first()
        .getByRole("button", { name: "Explore project ↗", exact: true })
        .click();
      assert.equal(
        await page
          .locator(".project-dialog")
          .evaluate((e) => e.scrollWidth <= e.clientWidth),
        true,
      );
      await close();
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: `${out}/reference-mobile.png` });
    },
  );
  await check("Mobile automated WCAG 2.2 A/AA", async () => {
    const a = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    await writeFile(
      `${out}/axe-mobile.json`,
      JSON.stringify(a.violations, null, 2),
    );
    assert.deepEqual(
      a.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
    );
  });
  await check(
    "Reduced motion retains static name and clickable projects",
    async () => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(
        await page.locator(".project-playground").getAttribute("data-physics"),
        "false",
      );
      assert.equal(
        await page
          .getByRole("button", { name: "Try Build Lab", exact: true })
          .isVisible(),
        true,
      );
      await page
        .getByRole("button", { name: "Try Build Lab", exact: true })
        .click();
      await page.locator('.build-lab[data-state="ready"]').waitFor();
      await page.locator(".build-open").click();
      assert.match(
        await page.locator("#project-title").innerText(),
        /GitCraft/i,
      );
      await close();
    },
  );
  await check(
    "Particles survive offscreen resize and do not overlap skills",
    async () => {
      await instant("#cv");
      await page.setViewportSize({ width: 900, height: 900 });
      await page.waitForTimeout(300);
      assert.equal(
        await page.locator(".particle-stage canvas").evaluate((c) =>
          c
            .getContext("2d")
            .getImageData(0, 0, c.width, c.height)
            .data.some((v, i) => i % 4 === 3 && v > 0),
        ),
        true,
      );
      assert.equal(
        await page
          .locator(".intro-stage")
          .evaluate((e) => getComputedStyle(e).overflow),
        "clip",
      );
    },
  );
  await check("No-JavaScript page exposes real content and links", async () => {
    const c = await browser.newContext({ javaScriptEnabled: false });
    const p = await c.newPage();
    await p.goto(origin);
    assert.equal(await p.locator("h1").isVisible(), true);
    assert.equal(await p.locator(".featured-project").count(), 6);
    assert.equal(await p.locator(".archive-project").count(), 9);
    assert.equal(
      await p.getByRole("link", { name: "Send an email" }).isVisible(),
      true,
    );
    await c.close();
  });
  await check("Sitemap, social image and favicon", async () => {
    assert.equal(
      (await (await context.request.get(`${origin}/sitemap.xml`)).text()).match(
        /<loc>/g,
      ).length,
      1,
    );
    for (const path of ["/opengraph-image", "/icon"]) {
      const r = await context.request.get(origin + path);
      assert.equal(r.status(), 200);
      assert.match(r.headers()["content-type"], /image\/png/);
    }
  });
  await check("No browser runtime errors", async () =>
    assert.deepEqual(errors, []),
  );
} finally {
  await writeFile(
    `${out}/redesign-results.json`,
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
if (results.some((r) => !r.passed)) process.exitCode = 1;
