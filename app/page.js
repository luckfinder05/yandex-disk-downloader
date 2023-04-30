"use client"

import Image from 'next/image'
import styles from './page.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router';

export default function Home() {
  const [link, setLink] = useState('');

  function inputHandler(ev) {
    setLink(ev.target.value)
  }
  function submitHandler(ev) {
    // ev.preventDefault();
    router.push(`api/ydl?link=' + ${link}`)
  }

  return (<>
    <h1 className={styles.header}>Загрузка файла с Яндекс.Диска</h1>
    <main className={styles.main}>
      <div >
        <form action={`api/ydl?link=' + ${link}`} >
          <input className={styles.inputText} onChange={inputHandler} type="text" name="link" id="link" />
          <input className={styles.inputBtn} type="submit" value="Скачать" />
        </form>
      </div>
    </main>
  </>
  )
}
