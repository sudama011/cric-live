import Navbar from './components/Navbar';

function App() {

  let data;
  async function task() {
    let url = 'http://localhost:9000/testAPI';
    try {
      let res = await fetch(url);
      data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  task();

  return (
    <>

      <Navbar title="Home" />
    
    </>
  );
}

export default App;
