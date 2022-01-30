import { TodoProvider } from "./context/TodoContext";
import Container from './components/Container.js';
import Footer from "./components/Footer";


function App() {


  return (
    <div className="w-full h-screen m-0 p-0 font-mono relative bg-orange-100 flex flex-col justify-center items-center ">
      <div className="m-auto h-5/6 pt-24 w-full">
        <TodoProvider >
          <Container></Container>
        </TodoProvider>
      </div>
      <div className="self-center justify-self-end">
      <Footer></Footer>
      </div>
     
      
    </div>

  );
}

export default App;
