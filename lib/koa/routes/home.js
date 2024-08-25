const route = async ({ request, response }) => {
  await response.render('home')
}

export { route }