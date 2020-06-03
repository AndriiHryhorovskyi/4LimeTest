module.exports = req => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bodyLength = 0;
    req
      .on("data", chunk => {
        chunks.push(chunk);
        bodyLength += chunk.length;
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (bodyLength > 1e6)
          return reject(
            new Error(
              `FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST. ${req.socket.localAddress} already sent ${bodyLength} bytes`,
            ),
          );
      })
      .on("end", () => {
        const bodyString = Buffer.concat(chunks, bodyLength).toString();

        try {
          const bodyJSON = JSON.parse(bodyString);
          return resolve(bodyJSON);
        } catch (e) {
          return resolve({});
        }
      });
  });
};
