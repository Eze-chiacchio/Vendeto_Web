export default async function handler(req, res) {
  const download = req.query.download === '1';
  const repo = 'NahueelN/PosWeb';
  try {
    const resp = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Vendeto-Web',
      },
    });
    if (!resp.ok) throw new Error(`GitHub API error ${resp.status}`);
    const data = await resp.json();
    const asset = data.assets.find(
      (a) => a.name.endsWith('-setup.exe') || a.name.endsWith('.exe')
    );
    const url = (asset && asset.browser_download_url) || data.html_url;

    if (download) {
      res.setHeader('Location', url);
      res.statusCode = 302;
      res.end();
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        tag: data.tag_name,
        name: data.name,
        url,
        published_at: data.published_at,
      })
    );
  } catch (e) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'No se pudo obtener la última versión.' }));
  }
}