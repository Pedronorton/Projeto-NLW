import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react'
import {Link, useHistory} from 'react-router-dom'
import './styles.css'
import {FiArrowLeft} from 'react-icons/fi'
import logo from '../../assets/logo.svg'
import { Map, TileLayer, Marker } from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet'
import api from '../../services/api'
import axios from 'axios'
import Dropzone from '../../components/Dropzone/index'



interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    //quando se cria um state com array ou objeto, preciso informar o tipo de dado que é 


    const [items, setItems] = useState<Item[]>([])
    
    const [ufs, setUfs] = useState<string[]>([])

    const [cities, setCities] = useState<string[]>([])

    const [selectedFile, setSelectedFile] = useState<File>()

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:'',
    })

    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [selectedUf, setSelectedUf] = useState('0')

    const [selectedCity, setSelectedCity] = useState('0')

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])

    const [initialPosition, setinitialPosition] = useState<[number, number]>([0,0])


    //QUAL FUNÇÃO QUERO EXECUTAR E QUANDO EU QUERO EXECUTAR 
    // SE MEU ARRAY ESTIVER VAZIO, ENTÃO ESSA FUNÇÃO SERÁ EXECUTADA APENAS UMA VEZ
    //QUANDO O COMPONENTE FOR CRIADO
    //seria uma espécie de mounted, create do vuejs
    const history = useHistory()

    useEffect( () =>{
        api.get('items').then(
            response => {
                setItems(response.data)
        })
        .catch(
            error => {
                alert(error)
            }
        )
    }, []);

    useEffect( () =>{
        
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(
            response => {
                const ufInitials = response.data.map(uf => uf.sigla)
                setUfs(ufInitials)
        })
        .catch(
            error => {
                alert(error)
            }
        )
    }, []);

    // preciso fazer essa requisição apenas quando eu selecionar o estado
    useEffect( () =>{
        if(selectedUf === '0'){
            return 
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/`+selectedUf+`/municipios`).then(
            response => {
                const cityName = response.data.map(city => city.nome)
                setCities(cityName)
        })
        .catch(
            error => {
                alert(error)
            }
        )
    }, [selectedUf]);

    useEffect( () =>{
        navigator.geolocation.getCurrentPosition(position =>{
            const {latitude, longitude} = position.coords;
            setinitialPosition([latitude,longitude])
            });
    }, []);

    //no vue é bem mais fácil fazer isso
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement> ){
        const uf = event.target.value
        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement> ){
        const city = event.target.value
        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent ){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]
        )
    }

    // no react simplifica a função -> no vue é mais fácil, com o nosso v-model
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target
        setFormData({...formData, [name]: value})

    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id); // parecido com index of, -1 se não tiver no array e >=0 se estiver
        if(alreadySelected >=0){
            const filteredItens = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItens)
        }else{
            setSelectedItems([ ...selectedItems, id])
        }
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const {name, email, whatsapp} = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData()

       
            data.append('name',name) 
            data.append('email',email)
            data.append('whatsapp',whatsapp)
            data.append('uf',uf)
            data.append('city',city)
            data.append('latitude',String(latitude))
            data.append('longitude',String(longitude))
            data.append('items',items.join(','))
            if(selectedFile){
                data.append('image', selectedFile)
            }        

        try{
            await api.post('points',data)
            alert("salvo com sucesso")
            history.push('/')
        }
        catch(e){
            alert("Erro ao salvar")

        }
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="logo ecoleta"/>
                <Link to="/">
                    <FiArrowLeft></FiArrowLeft>
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <Dropzone onFileUploaded={setSelectedFile}/> 
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name" 
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                    <div className="field">
                        <label htmlFor="name">E-mail</label>
                        <input 
                            type="email"
                            name="email"
                            id="email" 
                            onChange={handleInputChange}

                        />
                    </div>
                    <div className="field">
                        <label htmlFor="name">Whatsapp</label>
                        <input 
                            type="text"
                            name="whatsapp"
                            id="whatsapp" 
                            onChange={handleInputChange}
                        />
                    </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf}  onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}

                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(cityName => (
                                    <option value={cityName}>{cityName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais items abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {/* map faz uma varredura em um array, iterando nos intes dele */}
                        {items.map(item => (
                            <li 
                                key={item.id} onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}   
                            >
                                <img src={item.image_url} alt={`icone`+item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))} 
                        
                        
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
            
        </div>
    )
}

export default CreatePoint