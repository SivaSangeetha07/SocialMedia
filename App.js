import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography, Box } from '@mui/material';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [username, setUsername] = useState('');

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from the backend
  const fetchPosts = async () => {
    const response = await axios.get('http://localhost:5000/api/posts');
    setPosts(response.data);
  };

  // Handle the like button click
  const handleLike = async (id) => {
    await axios.post(`http://localhost:5000/api/posts/${id}/like`);
    fetchPosts();
  };

  // Handle new post creation
  const handleNewPost = async () => {
    if (newPost && username) {  // Check if both username and content are filled
      await axios.post('http://localhost:5000/api/posts', {
        username,
        content: newPost,
      });
      setNewPost('');
      fetchPosts();
    } else {
      alert('Please enter both a username and post content!');
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>Social Media Feed</Typography>
      
      {/* User Name Input */}
      <Card sx={{ padding: '16px', marginBottom: '20px' }}>
        <TextField
          label="Enter your name"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}  // Update the username state
          sx={{ marginBottom: '10px' }}
        />
      </Card>

      {/* New Post Form */}
      <Card sx={{ padding: '16px', marginBottom: '20px' }}>
        <TextField
          label="What's on your mind?"
          multiline
          fullWidth
          rows={3}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}  // Update the post content state
          sx={{ marginBottom: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleNewPost}>
          Post
        </Button>
      </Card>

      {/* Posts Feed */}
      {posts.map((post) => (
        <Card key={post.id} sx={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h6">{post.username}</Typography>
            <Typography variant="body1">{post.content}</Typography>
            <Button onClick={() => handleLike(post.id)}>Like ({post.likes})</Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default App;
