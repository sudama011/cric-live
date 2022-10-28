import { useState } from 'react';

import Footer from './components/Footer';
import Navbar from './components/Navbar';


function App() {

  const [home, sethome] = useState("all tournaments");

  async function task() {
    let url = 'http://localhost:9000/home';
    try {
      let res = await fetch(url);
      let data = await res.json();
      sethome(JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }

  task();

  return (
    <div style={{ "minHeight": "100vh" }}>

      <Navbar title="Home" />
      <main>
        {home}
      </main>
      <Footer />

    </div>

  );
}

export default App;
