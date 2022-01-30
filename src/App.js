import { TodoProvider } from "./context/TodoContext";
import Container from './components/Container.js';
import Footer from "./components/Footer";
import TodoFilter from "./components/TodoFilter";

function App() {


  return (
    <div className="w-full min-h-screen h-auto m-0 p-0 font-mono relative bg-orange-100 ">
      <div className="m-auto h-auto min-h-screen pt-24">
        <TodoProvider >
          <Container></Container>
        </TodoProvider>
      </div>
      <Footer></Footer>
      
    </div>

  );
}

export default App;
