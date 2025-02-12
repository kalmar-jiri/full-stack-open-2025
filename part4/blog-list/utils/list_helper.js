const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const likeArr = blogs.map(b => b.likes);
  return likeArr.length === 0 ? 0 : likeArr.reduce((acc, val) => acc + val, 0);
};

const favouriteBlog = blogs => {
  const likeArr = blogs.map(b => b.likes);

  return blogs.length === 0 ? {} : blogs[likeArr.indexOf(Math.max(...likeArr))];
};

const mostBlogs = blogs => {
  const blogNumberSummary = [];

  for (let blog of blogs) {
    if (!blogNumberSummary.some(a => a.author === blog.author)) {
      blogNumberSummary.push({
        author: blog.author,
        blogs: 1,
      });
    } else {
      const index = blogNumberSummary.indexOf(blogNumberSummary.find(a => a.author === blog.author));
      blogNumberSummary[index].blogs += 1;
    }
  }

  const blogNum = blogNumberSummary.map(b => b.blogs);

  return blogNumberSummary[blogNum.indexOf(Math.max(...blogNum))];
};

const mostLikes = blogs => {
  const likeNumberSummary = [];

  for (let blog of blogs) {
    if (!likeNumberSummary.some(a => a.author === blog.author)) {
      likeNumberSummary.push({
        author: blog.author,
        likes: blog.likes,
      });
    } else {
      const index = likeNumberSummary.indexOf(likeNumberSummary.find(a => a.author === blog.author));
      likeNumberSummary[index].likes += blog.likes;
    }
  }

  const likeNum = likeNumberSummary.map(b => b.likes);

  return likeNumberSummary[likeNum.indexOf(Math.max(...likeNum))];
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
