import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/BLOG APP/public/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
const upload = multer({ storage: storage })
const app=express();

const port=process.env.PORT || 3000;
let blogList = [];
app.set("view engine","ejs")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))



app.get("/",(req,res)=>{
    res.render("index.ejs")
})

app.get("/code-craft",(req,res)=>{
  res.render("code-craft.ejs")
})

app.get("/python",(req,res)=>{
  res.render("python-blog.ejs")
})

app.get("/dev-ops",(req,res)=>{
  res.render("dev-ops.ejs")
})

app.get("/create",(req,res)=>{
    res.render("create-post.ejs")
})

app.get("/about",(req,res)=>{
  res.render("about.ejs")
})

app.get("/contact",(req,res)=>{
  res.render("contact.ejs")
})

app.get("/programming-blogs",(req,res)=>{
  res.render("programming-blogs.ejs")
})
// Function to generate random ID
function generateID() {
  return Math.floor(Math.random() * 10000);
}



app.post("/programming-blogs",upload.single('filename'),(req,res)=>{
  const img=req.file["filename"];
  const title=req.body["title"];
  const description=req.body["description"];
  blogList.push({
    id: generateID(),
    cardImage: img,
    cardTitle:title,
    cardDescription:description,
  })
  res.render("programming-blogs.ejs",{
   blogList:blogList
  })
  console.log(blogList)
})

// Delete a blog
app.post("/delete/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  blogList = blogList.filter((blog) => blog.id !== blogId);
  console.log(blogList);
  res.render("programming-blogs.ejs", {
    blogList: blogList,
  });
});

//  Blog details page
app.get("/blogDetails/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
  res.render("blogDetails.ejs", {
    blogDetails: blogDetails,
  });
});

// Edit blog page
app.get("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
  res.render("create-post.ejs", {
    isEdit: true,
    blogDetails: blogDetails,
  });
});

// Update blog
app.post("/edit/:id", upload.single('filename'),(req, res) => {
  const blogId = req.params.id;
  const editBlog = blogList.findIndex((blog) => blog.id === parseInt(blogId));
  if (editBlog === -1) {
    res.send("<h1> Something went wrong </h1>");
  }
  const updatedImg=req.file["filename"];
  const updatedTitle = req.body["title"];
  const updatedDescription = req.body["description"];

  const blogImg=(blogList[editBlog].cardImage=updatedImg)
  const blogTitle = (blogList[editBlog].cardTitle = updatedTitle);
  const blogDescription = (blogList[editBlog].cardDescription = updatedDescription);
  [...blogList, {blogImg:blogImg, 
    blogTitle: blogTitle,
     blogDescription: blogDescription }];

  console.log(blogImg,blogTitle,blogDescription)

  res.render("programming-blogs.ejs", {
    isEdit: true,
    blogList: blogList,
  });
});


app.listen(port,()=>{
    console.log(`Listening on port ${port} `)
})