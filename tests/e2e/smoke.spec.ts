import { expect, test, type Page } from '@playwright/test';

/** Falha o teste se a página gerar erros não tratados. */
function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

const play = (page: Page) => page.getByRole('button', { name: 'Jogar', exact: true }).click();

test('abre no menu com o canvas do jogo ao fundo', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/gravity/i);
  await expect(page.getByRole('button', { name: 'Jogar', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Recordes' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('jogar com teclado e clique não gera erros', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?seed=123&lives=3');
  await play(page);
  await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(450);
  }
  await page.mouse.click(640, 360);
  await page.waitForTimeout(400);
  expect(errors).toEqual([]);
});

test('pausar com Esc, continuar com contagem, reiniciar e voltar ao menu', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?seed=123&lives=3');
  await play(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Pausado' })).toBeVisible();

  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible();
  await page.waitForTimeout(3500); // contagem 3-2-1

  await page.getByRole('button', { name: 'Pausar' }).click();
  await page.getByRole('button', { name: 'Reiniciar' }).click();
  await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible();

  await page.keyboard.press('p');
  await expect(page.getByRole('heading', { name: 'Pausado' })).toBeVisible();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Jogar', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('fim de jogo mostra resultado, reinicia e registra o recorde', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?seed=1&lives=1');
  await play(page);
  await expect(page.getByRole('heading', { name: 'Fim de jogo' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Quase-colisões')).toBeVisible();

  // Volta ao menu e confere que a pontuação entrou no ranking local.
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Recordes' }).click();
  await expect(page.getByRole('heading', { name: 'Recordes' })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Melhores pontuações' }).getByRole('listitem')).toHaveCount(1);
  await page.getByRole('button', { name: 'Voltar' }).click();

  // Jogar de novo a partir do menu funciona.
  await play(page);
  await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('recordes mostram o estado vazio na primeira visita', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Recordes' }).click();
  await expect(page.getByText('Nenhuma partida ainda')).toBeVisible();
});

test('as configurações de som ficam salvas depois de recarregar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Som e efeitos' }).click();
  const mute = page.getByRole('switch', { name: 'Mudo' });
  await expect(mute).toHaveAttribute('aria-checked', 'false');
  await mute.click();
  await expect(mute).toHaveAttribute('aria-checked', 'true');

  await page.reload();
  await page.getByRole('button', { name: 'Som e efeitos' }).click();
  await expect(page.getByRole('switch', { name: 'Mudo' })).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('em retrato no celular aparece o aviso para girar o aparelho', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Gire o aparelho');
  await page.setViewportSize({ width: 800, height: 390 });
  await expect(page.getByRole('alert')).toHaveCount(0);
});
