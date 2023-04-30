import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const https = require('https');


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const yDiskLink = await decodeURIComponent(searchParams.get('link'));

  return new NextResponse.redirect(302, 'https://nvtsk.ru/api/ydl/' + yDiskLink);
  let res;

  try {
    let resultFileName, resultYDiskhref;

    // Получаем информацию о файле
    console.log('Получаем информацию о файле: ');
    await fetch(`https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${yDiskLink}`)
      .then(res => res.json())
      .then(res => {
        console.log('res: ', res);
        resultFileName = res.name;
        if (res.type === 'dir') resultFileName += '.zip'
      })
    console.log('resultFileName: ', resultFileName);

    // Получаем прямую ссылку
    console.log('Получаем прямую ссылку: ');
    await fetch(`https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${yDiskLink}`)
      .then(res => res.json())
      .then(res => {
        console.log('res: ', res);
        resultYDiskhref = res.href
      })
    console.log('resultYDiskhref: ', resultYDiskhref);
    if (!resultYDiskhref) return new NextResponse('', { status: 404 })

    // call
    console.log('call: ');
    return new NextResponse(await getData(resultYDiskhref, res), {
      status: 200,
      headers: {
        'Content-Type': `application/octet-stream`,
        'Content-Disposition': 'attachment;filename*=UTF-8\'\'' + encodeURI(resultFileName)
      }
    });



    async function getData(url) {
      return await new Promise((resolve, reject) => get(url, resolve, reject));
    }

    function get(url, resolve, reject) {
      try {
        https.get(url, (response) => {
          // if any other status codes are returned, those needed to be added here
          if (response.statusCode === 301 || response.statusCode === 302) {
            return get(response.headers.location, resolve, reject)
          }

          resolve(response)
        });
      } catch (err) {
        reject(err);
      }
    }

  }
  catch (e) {
    console.dir(e);
    res.status(400).json({
      message: 'Ошибка скачивания файла с Яндекс.диска или создания ссылки',
      msg: e
    });
  }
}
