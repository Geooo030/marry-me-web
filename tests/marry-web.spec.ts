import { expect, test } from "@playwright/test";

const GUEST_NAMES = [
  "贵妇嘉",
  "欣子有话说",
  "蜻蜓队长",
  "binke",
  "烧烤师傅",
  "鸡叔叔",
  "妍之代理人",
  "戒赌治疗中",
  "屠夫",
  "耳朵",
  "嘻嘻",
  "猪肉佬",
  "QQ",
  "B伟表弟",
];

const noHorizontalOverflow = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );

test("首页展示全部 14 位嘉宾且无横向滚动", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /班主任小王吧/ }),
  ).toBeVisible();

  for (const name of GUEST_NAMES) {
    await expect(
      page.getByRole("button", { name: new RegExp(name) }),
    ).toBeVisible();
  }

  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "screenshots/home-mobile.png", fullPage: true });
});

test("选择嘉宾后进入个人页，刷新后仍停留", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /贵妇嘉/ }).click();
  await page.waitForURL(/#\/guest\/gui-fu-jia$/);

  await expect(page.getByRole("heading", { name: "贵妇嘉" })).toBeVisible();
  await expect(page.getByText("陪瑶瑶买烧烤材料")).toBeVisible();
  await expect(page.getByText("保密行动")).toBeVisible();
  await page.screenshot({ path: "screenshots/guest-mobile.png", fullPage: true });

  await page.reload();
  await expect(page.getByRole("heading", { name: "贵妇嘉" })).toBeVisible();
});

test("全天总览展示全部时间线节点", async ({ page }) => {
  await page.goto("/#/guest/binke");
  await page.getByRole("tab", { name: "全天总览" }).click();

  await expect(page.getByText("策划布置时间")).toBeVisible();
  await expect(page.getByText("瑶瑶备料 · 嘉宾陆续到场")).toBeVisible();
  await expect(page.getByText("求婚时刻")).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(0);
});

test("无效嘉宾 id 回退到首页", async ({ page }) => {
  await page.goto("/#/guest/not-exist");
  await expect(
    page.getByRole("heading", { name: /班主任小王吧/ }),
  ).toBeVisible();
});

test("桌面窄视口渲染正常", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /蜻蜓队长/ }),
  ).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "screenshots/home-desktop-narrow.png", fullPage: true });
});

test("地点详情弹窗展示手绘地图与地址操作", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /查看地点详情/ }).click();
  await expect(page.locator(".venue-sheet")).toBeVisible();
  await expect(page.locator(".venue-map-img")).toBeVisible();
  await expect(page.getByText("广东省东莞市东福商业街水印长堤2栋")).toBeVisible();
  await expect(page.getByRole("button", { name: /高德地图/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /系统地图/ })).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(0);
});

test("减少动态效果时页面仍可正常使用", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /binke/ }).click();
  await page.waitForURL(/#\/guest\/binke$/);

  await expect(page.getByRole("heading", { name: "binke" })).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(0);
});

test("首页展示瑶瑶的一封信封口卡片", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /瑶瑶的一封信/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /我的手机密码/ }),
  ).toBeVisible();
  await expect(page.getByText("一封封口的信，输入暗号才能拆开")).toBeVisible();
});

test("输入错误暗号无法拆信", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /我的手机密码/ }).click();
  await page.getByLabel("暗号第 1 位").fill("0");
  await page.getByLabel("暗号第 2 位").fill("0");
  await page.getByLabel("暗号第 3 位").fill("0");
  await page.getByLabel("暗号第 4 位").fill("0");
  await page.getByLabel("暗号第 5 位").fill("0");
  await page.getByLabel("暗号第 6 位").fill("0");
  await page.getByRole("button", { name: /拆开这封信/ }).click();
  await expect(page.getByText("暗号不对，再试一次")).toBeVisible();
  await expect(page.getByText("亲爱的瑶瑶：")).not.toBeVisible();
});

test("输入 120197 暗号后拆开信件", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /瑶瑶的一封信/ }).click();
  await expect(page.getByText("前面 12 已经替你放好了，输入四个数字")).toHaveCount(0);
  await expect(page.getByText("输入我的手机密码，就能拆开这封信")).toBeVisible();
  await page.getByLabel("暗号第 1 位").fill("1");
  await page.getByLabel("暗号第 2 位").fill("2");
  await page.getByLabel("暗号第 3 位").fill("0");
  await page.getByLabel("暗号第 4 位").fill("1");
  await page.getByLabel("暗号第 5 位").fill("9");
  await page.getByLabel("暗号第 6 位").fill("7");
  await page.getByRole("button", { name: /拆开这封信/ }).click();
  await expect(
    page.getByRole("heading", { name: "瑶瑶的一封信" }),
  ).toBeVisible();
  await expect(page.getByText("Love at first sight")).toBeVisible();
  await expect(page.getByText("他们都在陪我一起“表演”")).toBeVisible();
  await expect(page.getByText("你的 班主任小王吧")).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(0);
});
