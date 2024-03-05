var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postrModel = require("./post");
const passport = require('passport');
const localStrategy = require('passport-local')
const upload = require("./multer")


passport.use(new localStrategy(userModel.authenticate()))

//default route for login
router.get('/', function (req, res) {
  res.render('index');
});
//register
router.get('/register', function (req, res) {
  res.render('register');
});
//for profilr
router.get('/profile', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate('posts')
  console.log(user.posts[0]?.img)
  console.log(user.profileimg, "profilr")
  res.render('profile', { img: user.profileimg, name: user.name, uname: user.username, user });
});
//users post
router.get('/show/posts', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate('posts')
  console.log(user.posts[0]?.img)
  res.render('show', { img: user.profileimg, name: user.name, uname: user.username, user });
});



//registering route
router.post('/register', function (req, res) {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name
  })
  userModel.register(data, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })

});

// login route
router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile",
}), function (req, res) {
});

//for logging out
router.get('/logout', function (req, res) {
  req.logOut(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  })
})

//checking for active login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
//for creating new post page
router.get('/post', function (req, res) {
  res.render('post');
});
//for uploading post
router.post('/post', isLoggedIn, upload.single('image'), async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const post = await postrModel.create({
    user: user._id,
    title: req.body.title,
    desc: req.body.desc,
    img: req.file.filename
  })

  user.posts.push(post._id);
  await user.save()
  res.redirect('/profile')
});

//for editing profile
router.get('/edit', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  // res.send(user)
  res.render('edit', { img: user.profileimg, name: user.name, uname: user.username, mail: user.email, pass: user.password });
});
//feed
router.get('/feed', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const post = await postrModel.find().populate("user")
  res.render('feed', { post, user });

});
//for Specific pin
router.get('/feed/:id', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  let id = req.params.id
  const post = await postrModel.findOne({ img: id }).populate("user")
  res.render('postpin', { post, user });

});
//for editing profile(post)
router.post('/edit', isLoggedIn, upload.single('image'), async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  if (req.file) {
    user.profileimg = req.file.filename;
  }
  user.email = req.body.email
  user.name = req.body.name
  await user.save()
  res.redirect('/profile')
});


module.exports = router;
