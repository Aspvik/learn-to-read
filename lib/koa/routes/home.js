const route = async ({ request, response }) => {
  await response.render('home', { title: 'Login' })
}

export { route }