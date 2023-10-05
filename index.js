// const express = require('express');
// const fetch = require('node-fetch');
// const _ = require('lodash');

import express from 'express';
import fetch from 'node-fetch';
import _ from 'lodash';


const app = express();
const PORT = 3000;

const API_URL = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const API_SECRET = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';

// Middleware for fetching and analyzing blog data


app.get('/api/blog-stats', async (req, res) => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'x-hasura-admin-secret': API_SECRET,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch blog data');
      }
  
      const blogs = await response.json();
  
      // Check if blogs is an array and not empty
      if (Array.isArray(blogs) && blogs.length > 0) {
        // Perform analytics only if there are blogs
        const totalBlogs = blogs.length;
        const longestBlog = _.maxBy(blogs, blog => blog.title.length);
        const privacyBlogs = _.filter(blogs, blog => _.includes(blog.title.toLowerCase(), 'privacy'));
        const uniqueTitles = _.uniqBy(blogs, 'title');
  
        const analyticsData = {
          totalBlogs,
          longestBlog: longestBlog ? longestBlog.title : null,
          privacyBlogs: privacyBlogs.length,
          uniqueTitles: uniqueTitles.map(blog => blog.title),
        };
  
        res.json(analyticsData);
      } else {
        // Handle the case when the fetched data is not valid
        res.status(500).json({ error: 'Invalid blog data received' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Search endpoint

app.get('/api/blog-search', (req, res) => {
    const query = req.query.query;
  
    // Check if the query parameter is present and is a non-empty string
    if (query && typeof query === 'string' && query.trim() !== '') {
      // Convert the query to lowercase and perform the search
      const searchResults = _.filter(blogs, blog => _.includes(blog.title.toLowerCase(), query.toLowerCase()));
      res.json(searchResults);
    } else {
      // Handle the case when the query parameter is missing or empty
      res.status(400).json({ error: 'Invalid or missing query parameter' });
    }
  });
  

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
