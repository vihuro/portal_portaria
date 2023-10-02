"use client"
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import Api from "../service/api/portaria";
import { DateTimeStringFormat } from "../utils/DateTimeString";
import { BiLogoPlayStore, BiStop } from "react-icons/bi"
import AddNovaEntrada from "./Add/CriarEntrada";


interface dataProps {
    cliente: string,
    dataHoraEntrada: Date,
    dataHoraSaida: Date,
    numeroEntrada: number,
    razacao: string,
    primeiroResponsavel: string,
    segundoResponsavel: string,
    tempoAtendimento: Date,
    transportadora: string
}

export default function Table() {

    const [data, setData] = useState<dataProps[]>([]);
    const [tooglAdd, setToogleAdd] = useState<boolean>(false);
    async function FetchData() {
        await Api.get("/entrada")
            .then(res => {
                console.log(res.data)
                setData(res.data)
            })
            .catch(err => console.log(err))
    }
    interface dateTimer {
        datataHoraEntrada: Date,
        dataHoraSaida: Date,
        timer: Date
    }
    const [time, setTime] = useState(new Date());
    const [runTimer, setRunTimer] = useState<boolean>(false);
    useEffect(() => {
        FetchData();
    }, [])


    // useEffect(() => {

    //     const tick = setInterval(() => {
    //         // FetchData();
    //         MontarTabela()
    //         setTime(new Date());
    //     }, 100);
    //     return () => clearInterval(tick);
    // }, [])



    const HORA_PADRACAO = "00:00";

    function Timer(date: dateTimer) {

        var dateStringSaida = DateTimeStringFormat(date.dataHoraSaida)
        if (dateStringSaida == "00:00") {

            const diferencaEmMilissegundos = new Date(date.datataHoraEntrada).getTime() - Date.now();
            const segundos = Math.floor(Math.abs(diferencaEmMilissegundos) / 1000);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);
            const horasFormatadas = horas.toString().padStart(2, "0");
            const minutosFormatados = (minutos % 60).toString().padStart(2, "0");
            const segundosFormatados = (segundos % 60).toString().padStart(2, "0");


            return `${horasFormatadas}:${minutosFormatados}:${(segundosFormatados)}`
        }

    }
    function ValidateColorRowInTable(date: Date){
        const diferencaEmMilissegundos = new Date(date).getTime() - Date.now();

        const segundos = Math.floor(Math.abs(diferencaEmMilissegundos) / 1000);

        const segundosFormatados = (segundos % 60);

        console.log(segundosFormatados)

        if(segundosFormatados >= 25 ) {
            return{
                background:"red"
            }
        }
        return{
            background:"green"
        }

    }

    function ValidateStatus(item: dataProps) {
        const dateStringSaida = DateTimeStringFormat(item.dataHoraSaida)
        if (dateStringSaida === HORA_PADRACAO) {
            return "CHG"
        }
        return "SDA"
    }

    const { Card, FetchResponsavel } = AddNovaEntrada({
        changeToogle: setToogleAdd,
        refreshTable: FetchData
    });
    function MontarTabela() {
        return (
            <section className={styles.containerTable} >
                <div className={tooglAdd ?
                    styles.cardAddEntrada :
                    styles.cardAddEntrada_close} >
                    <div className={styles.containerCardEntrada} >
                        <Card />
                    </div>
                </div>
                <div className={styles.container_action} >
                    <div>
                        <BiLogoPlayStore />
                        <BiStop />
                    </div>
                    <div className={styles.containerButtonAdd} >
                        <button className={styles.button} onClickCapture={() => {
                            FetchResponsavel()
                            setToogleAdd(!tooglAdd)
                        }}>
                            NOVA ENTRADA
                        </button>
                    </div>
                </div>
                <div className={styles.wrapContainerTable} >
                    <table className={styles.table} >
                        <thead className={styles.thead} >
                            <tr>
                                <th>Nº</th>
                                <th>STATUS</th>
                                <th>TRANSPORTADORA</th>
                                <th>CLIENTE</th>
                                <th>RAZÃO</th>
                                <th>RESP. 1</th>
                                <th>RESP. 2</th>
                                <th>DATA/HORA ENTRADA</th>
                                <th>DATA/HORA SAÍDA</th>
                                <th>TIMER</th>
                                <th>OBS</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody} >
                            {data && (
                                data.map((item, index) => {

                                    const status = ValidateStatus(item)
                                    const tempoPercorrido = Timer({
                                        dataHoraSaida: item.dataHoraSaida,
                                        datataHoraEntrada: item.dataHoraEntrada,
                                        timer: item.tempoAtendimento
                                    })

                                    return (
                                        <tr style={ValidateColorRowInTable(item.dataHoraEntrada)} key={index} >
                                            <td>{item.numeroEntrada}</td>
                                            <td>{status}</td>
                                            <td>{item.transportadora}</td>
                                            <td>{item.cliente}</td>
                                            <td>{item.razacao}</td>
                                            <td>{item.primeiroResponsavel}</td>
                                            <td>{item.segundoResponsavel}</td>
                                            <td>{DateTimeStringFormat(item.dataHoraEntrada)}</td>
                                            <td>{DateTimeStringFormat(item.dataHoraSaida)}</td>
                                            <td>{Timer({
                                                dataHoraSaida: item.dataHoraSaida,
                                                datataHoraEntrada: item.dataHoraEntrada,
                                                timer: item.tempoAtendimento
                                            })}</td>
                                            <td>NÃO COUBE A MERCADORIA</td>
                                            <td>
                                                <p style={{
                                                    fontSize: 11,
                                                    background: "#289cbd",
                                                    color: "white",
                                                    marginBottom: 3,
                                                    padding: 3,
                                                    borderRadius: 5,
                                                    cursor: "pointer"
                                                }} >SAÍDA</p>
                                                <p style={{
                                                    fontSize: 11,
                                                    background: "#db1111",
                                                    color: "white",
                                                    padding: 3,
                                                    borderRadius: 5,
                                                    cursor: "pointer"
                                                }} >CANCELADA</p>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                            <tr>

                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={13} >
                                    {`TOTAL DE CARREGAMENTOS: ${data.length}`}
                                </td>

                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section >
        )
    }
    return (
        <MontarTabela />
        // <section className={styles.containerTable} >
        //     <div className={tooglAdd ?
        //         styles.cardAddEntrada :
        //         styles.cardAddEntrada_close} >
        //         <div className={styles.containerCardEntrada} >
        //             <Card />
        //         </div>
        //     </div>
        //     <div className={styles.container_action} >
        //         <div>
        //             <BiLogoPlayStore />
        //             <BiStop />
        //         </div>
        //         <div className={styles.containerButtonAdd} >
        //             <button className={styles.button} onClickCapture={() => {
        //                 FetchResponsavel()
        //                 setToogleAdd(!tooglAdd)
        //             }}>
        //                 NOVA ENTRADA
        //             </button>
        //         </div>
        //     </div>
        //     <div className={styles.wrapContainerTable} >
        //         <table className={styles.table} >
        //             <thead className={styles.thead} >
        //                 <tr>
        //                     <th>Nº</th>
        //                     <th>STATUS</th>
        //                     <th>TRANSPORTADORA</th>
        //                     <th>CLIENTE</th>
        //                     <th>RAZÃO</th>
        //                     <th>RESP. 1</th>
        //                     <th>RESP. 2</th>
        //                     <th>DATA/HORA ENTRADA</th>
        //                     <th>DATA/HORA SAÍDA</th>
        //                     <th>TIMER</th>
        //                     <th>OBS</th>
        //                     <th></th>
        //                     <th>TOT. CARR</th>
        //                 </tr>
        //             </thead>
        //             <tbody className={styles.tbody} >
        //                 {data && (
        //                     data.map((item, index) => {

        //                         const status = ValidateStatus(item)
        //                         return (
        //                             <tr style={{
        //                                 background: index === 1 ? "red" : "#31bd28"
        //                             }} key={index} >
        //                                 <td>{item.numeroEntrada}</td>
        //                                 <td>{status}</td>
        //                                 <td>{item.transportadora}</td>
        //                                 <td>{item.transportadora}</td>
        //                                 <td>{item.razacao}</td>
        //                                 <td>{item.primeiroResponsavel}</td>
        //                                 <td>{item.segundoResponsavel}</td>
        //                                 <td>{DateTimeStringFormat(item.dataHoraEntrada)}</td>
        //                                 <td>{DateTimeStringFormat(item.dataHoraSaida)}</td>
        //                                 <td>{Timer({
        //                                     dataHoraSaida: item.dataHoraSaida,
        //                                     datataHoraEntrada: item.dataHoraEntrada,
        //                                     timer: item.tempoAtendimento
        //                                 })}</td>
        //                                 <td>NÃO COUBE A MERCADORIA</td>
        //                                 <td>
        //                                     <p style={{
        //                                         fontSize: 11,
        //                                         background: "#289cbd",
        //                                         color: "white",
        //                                         marginBottom: 3,
        //                                         padding: 3,
        //                                         borderRadius: 5,
        //                                         cursor: "pointer"
        //                                     }} >SAÍDA</p>
        //                                     <p style={{
        //                                         fontSize: 11,
        //                                         background: "#db1111",
        //                                         color: "white",
        //                                         padding: 3,
        //                                         borderRadius: 5,
        //                                         cursor: "pointer"
        //                                     }} >CANCELADA</p>
        //                                 </td>
        //                                 <td>8</td>
        //                             </tr>
        //                         )
        //                     })
        //                 )}
        //                 <tr>

        //                 </tr>
        //             </tbody>
        //             <tfoot>
        //                 <tr>
        //                     <td colSpan={13} >
        //                         {`TOTAL DE CARREGAMENTOS: ${data.length}`}
        //                     </td>

        //                 </tr>
        //             </tfoot>
        //         </table>
        //     </div>
        // </section >
    )
}