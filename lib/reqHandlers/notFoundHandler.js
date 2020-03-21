import fs from 'fs';
import path from 'path';

const NotFoundHandler = (req, res) => {
  const url = req.path;

  // TODO Fix this
  if (url === '' || url === '/' || url === '/dashboard') {
    fs.readFile(path.join(__dirname, '../../', 'app', 'dist', 'index.html'), (err, indexFile) => {
      if (err) {
        res.status(404);
        return res.jsonp({
          error: res.msg404 || 'Resource not found',
        });
      }

      res.type('text/html');
      res.send(indexFile.toString());
    });

    return;
  }

  res.status(404);
  return res.jsonp({
    error: res.msg404 || 'Resource not found',
  });
};

export default NotFoundHandler;
