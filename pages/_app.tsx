import { AppProps } from "next/app"
import React from "react"
import { Inter } from 'next/font/google'
import "./global.css"
import Head from 'next/head'


const inter = Inter({ subsets: ['latin'] })
export default function App({
    Component,
    pageProps
}: AppProps) {

    return (
        <div className={inter.className} >
            <Head>
                <title>THR</title>
            </Head>
            <Component {...pageProps} />
        </div>
    )

}