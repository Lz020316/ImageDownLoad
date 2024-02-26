const express = require('express');  
const axios = require('axios');  
const sharp = require('sharp');  
const fs = require('fs');  
const path = require('path');  
const crypto = require('crypto');  
const app = express();  
const port = 6000;  
  
app.use(express.static('public')); // 假设静态文件存放在 public 文件夹  
  
app.get('/download-image', async (req, res) => {  
  const imageUrl = req.query.url; // 从查询参数中获取图片链接  
  if (!imageUrl) {  
    return res.status(400).send('Image URL is required');  
  }  
  
  try {  
    // 下载图片  
    const response = await axios.get(imageUrl, {  
      responseType: 'arraybuffer', // 接收原始二进制数据  
    });  
  
    // 使用 sharp 将图片转换为 PNG 格式  
    const buffer = Buffer.from(response.data, 'binary');  
    const pngBuffer = await sharp(buffer)  
      .png() // 转换为 PNG  
      .toBuffer();  
  
    // 生成随机文件名  
    const randomFileName = `download_${crypto.randomBytes(8).toString('hex')}.png`;  
  
    // 设置响应头，告诉浏览器这是一个文件下载请求  
    res.attachment(randomFileName);  
    res.set('Content-Type', 'image/png'); // 设置正确的 MIME 类型  
  
    // 发送 PNG 图片的二进制数据给客户端  
    res.send(pngBuffer);  
  } catch (error) {  
    console.error('Error downloading or converting image:', error);  
    return res.status(500).send('Error downloading or converting image');  
  }  
});  
  
app.listen(port, () => {  
  console.log(`Server is running on port ${port}`);  
});