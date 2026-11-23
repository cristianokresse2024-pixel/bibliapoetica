const vipAccounts = new Set([
  'cristianokresse2024@gmail.com',
  'jheisyellen91@gmail.com',
  'cristianokresse@gmail.com',
  'contato@vivainteligente.com.br',
  'admin@vivainteligente.com.br',
]);

export function isVipEmail(email) {
  return vipAccounts.has(email);
}
