
  addEventListener('fetch', event => {
    event.respondWith(handleRequest(event))
  })
  
  async function handleRequest(event) {
    try {
      const request = event.request;
      for (const url of c_urlList) {
        event.waitUntil(await triggerForward(request, url));
      }
      return new Response('OK');
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 500 })
    }
  }

  async function triggerForward(originalRequest, url) {
    try {
      const contentType = originalRequest.headers.get('content-type') || '';
  
      let body;
  
      if (contentType.includes('application/json')) {
        // Clone and read JSON
        body = await originalRequest.clone().text(); 
        // Could also do .json() then JSON.stringify()
      } 
      else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
        // Clone and read formData
        body = await originalRequest.clone().formData();
      } 
      else {
        // Fallback: send as raw text or arrayBuffer if needed
        body = await originalRequest.clone().arrayBuffer();
      }
  
      // Forward the request
      await fetch(url, {
        method: originalRequest.method,
        headers: originalRequest.headers,
        body
      });
  
    } catch (err) {
      console.error(`Background forward to ${url} failed:`, err);
    }
  }

  const c_urlList = [
    'https://google.com',
    'https://163.com',
  ];
