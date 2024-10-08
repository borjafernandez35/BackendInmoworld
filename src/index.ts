import express,{RequestHandler} from 'express'
import cors from 'cors'
import userRouter from './routes/user'
import propertyRouter from './routes/property'
import reviewRouter from './routes/review'
import { run } from './database/mongo_conn'

const app = express();
app.use(express.json());
run();

app.use(cors());
app.use(express.json() as RequestHandler);
const PORT = 3001;

app.get('/ping', (_req , res) => {
    console.log('ping recibido correctamente')
    res.send('pinged')
})

app.use('/user',userRouter)
app.use('/property',propertyRouter)
app.use('/review',reviewRouter)

app.listen(PORT, () => {
    console.log('el servidor esta escuchando en el puerto '+ PORT)
})