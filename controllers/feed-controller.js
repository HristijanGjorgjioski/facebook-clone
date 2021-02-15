

exports.getWall = (req, res, next) => {
  res.render('feed/wall', {
    pageTitle: 'Feed'
  })
}