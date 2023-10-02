import { useEffect, useState } from "react";
import Api from "../../service/api/portaria";
import styles from "./style.module.css";

interface responsavelProps {
    id: number,
    nome: string
}

interface props {
    refreshTable: Function,
    changeToogle: Function
}

export default function Card({ changeToogle, refreshTable }: props) {
    const [data, setData] = useState<responsavelProps[]>([])

    async function FetchResponsavel() {
        await Api.get("/responsavel")
            .then(res => {
                setData(res.data)
                console.log(res.data)
            })
            .catch(err => console.log(err))
    }

    function Card() {
        const [listRazao, setListRazao] = useState<boolean>(false);
        const [listPrimeiroResponsavel, setListPrimeiroResponsavel] = useState<boolean>(false);
        const [listSegundoReposavel, setListSegundoReponsavel] = useState<boolean>(false);
        const [primeroResponsave, setPrimeiroResponsavel] = useState({
            id: 0,
            nome: ""
        })
        const [segundoResposavel, setSegundoResponsavel] = useState({
            id: 0,
            nome: ""
        })
        const [novaEntrada, setNovaEntrada] = useState({
            transportadora: "",
            cliente: "",
            razao: ""
        })

        async function InsertEntrada() {
            if (novaEntrada.cliente === "" ||
                novaEntrada.transportadora === "") {

                console.log("campos vazios")
                return;
            }

            const obj = {
                transportadora: novaEntrada.transportadora,
                cliente: novaEntrada.cliente,
                razao: novaEntrada.razao,
                primeroResponsavel: primeroResponsave.id,
                segundoResponsavel: segundoResposavel.id
            }
            console.log(obj)

            await Api.post("/entrada", obj)
                .then(res => {
                    refreshTable()
                    setNovaEntrada({
                        cliente: "",
                        razao: "",
                        transportadora: ""
                    })
                    setPrimeiroResponsavel({
                        id: 0,
                        nome: ""
                    })
                    setSegundoResponsavel({
                        id: 0,
                        nome: ""
                    })
                    changeToogle(false)
                })
                .catch(err => console.log(err))
        }


        return (
            <form className={styles.form} onClick={() =>{
                setListPrimeiroResponsavel(false)
                setListRazao(false)
                setListSegundoReponsavel(false)
            }} >
                <header className={styles.title} >
                    <h3>ENTRADA</h3>
                </header>
                <main className={styles.body} >
                    <div className={styles.containerTransportadora} >
                        <input required
                            id="txtTransportadora"
                            type="text"
                            value={novaEntrada.transportadora}
                            onChange={(e) => setNovaEntrada({
                                ...novaEntrada,
                                transportadora: e.target.value
                            })}
                        />
                        <label htmlFor="txtTransportadora">TRANSPORTADORA</label>
                    </div>
                    <div className={styles.containerCliente} >
                        <input id="txtCliente" required
                            type="text"
                            value={novaEntrada.cliente}
                            onChange={(e) => setNovaEntrada({
                                ...novaEntrada,
                                cliente: e.target.value
                            })}
                        />
                        <label htmlFor="txtCliente">CLIENTE</label>
                    </div>
                    <div className={styles.contianerRazao} >
                        <input type="text"
                            id="txtRazao"
                            required
                            value={novaEntrada.razao}
                            onChange={() => { }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setListRazao(!listRazao)
                                setListPrimeiroResponsavel(false)
                                setListSegundoReponsavel(false)
                            }} />
                        <label htmlFor="txtRazao">RAZÃO</label>
                        <ul className={listRazao ?
                            styles.containerListRazacao :
                            styles.containerListRazacao_close} >
                            <li onClick={() => {
                                setNovaEntrada({
                                    ...novaEntrada,
                                    razao: "COLETA"
                                })
                                setListRazao(false)
                            }}>COLETA</li>
                            <li onClick={() => {
                                setNovaEntrada({
                                    ...novaEntrada,
                                    razao: "RETIRA"
                                })
                                setListRazao(false)
                            }}>RETIRA</li>
                            <li onClick={() => {
                                setNovaEntrada({
                                    ...novaEntrada,
                                    razao: "COMPRAS"
                                })
                                setListRazao(false)
                            }}>COMPRAS</li>
                            <li onClick={() => {
                                setNovaEntrada({
                                    ...novaEntrada,
                                    razao: "DEV"
                                })
                                setListRazao(false)
                            }}>DEV</li>
                            <li onClick={() => {
                                setNovaEntrada({
                                    ...novaEntrada,
                                    razao: "R.C"
                                })
                                setListRazao(false)
                            }}>R.C</li>
                        </ul>
                    </div>
                    <div className={styles.containerPrimeiroResponsavel} >
                        <input required type="text"
                            id="txtResponsavel1"
                            value={primeroResponsave.nome}
                            onChange={() => { }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setListRazao(false)
                                setListPrimeiroResponsavel(!listPrimeiroResponsavel)
                                setListSegundoReponsavel(false)
                            }} />
                        <label htmlFor="txtResponsavel1">RESPONSÁVEL 1</label>
                        <ul className={listPrimeiroResponsavel ?
                            styles.containerListPrimeiroResponsavel :
                            styles.containerListPrimeiroResponsavel_close} >
                            {data && (
                                data.map((item, index) => (
                                    <li onClick={() => {
                                        setPrimeiroResponsavel({
                                            id: item.id,
                                            nome: item.nome
                                        })
                                        setListPrimeiroResponsavel(false)
                                    }} key={index} >{item.nome}</li>
                                ))
                            )}
                        </ul>
                    </div>
                    <div className={styles.containerSegundoResponsavel} >
                        <input required type="text"
                            id="txtResponsavel2"
                            value={segundoResposavel.nome}
                            onChange={() => { }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setListRazao(false)
                                setListPrimeiroResponsavel(false)
                                setListSegundoReponsavel(!listSegundoReposavel)
                            }} />
                        <label htmlFor="txtResponsavel2">RESPONSÁVEL 2</label>
                        <ul className={listSegundoReposavel ?
                            styles.containerListSegundoResponsavel :
                            styles.containerListSegundoResponsavel_close} >
                            {data && (
                                data.map((item, index) => (
                                    <li onClick={() => {
                                        setSegundoResponsavel({
                                            id: item.id,
                                            nome: item.nome
                                        })
                                        setListSegundoReponsavel(false)
                                    }} key={index} >{item.nome}</li>
                                ))
                            )}
                        </ul>
                    </div>
                </main>
                <footer>
                    <div className={styles.cotainerButton}>
                        <button className={styles.button} type="button" onClick={() => InsertEntrada()} >
                            INSERIR
                        </button>
                    </div>
                </footer>
            </form>
        )
    }

    return {
        FetchResponsavel,
        Card
    }
}