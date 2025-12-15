import logo from './logo.svg';
import './App.css';
import Virtualization from './components/virtualization/Virtualization.jsx';
import InfiniteScroll from './components/infiniteScroll/InfiniteScroll.jsx';
import Pagination from './components/pagination/Pagination.jsx';
import Notes from './components/notes/Notes.jsx';

function App() {

  const list = Array.from({ length: '1000' }, (_, index) => index + 1)

  return (
    <div className="App">
      {/* <Virtualization list={list} height={400} width={300} itemHeight={35} /> */}
      {/* <InfiniteScroll list={list} /> */}
      {/* <Pagination /> */}
      <Notes/>
    </div>
  );
}

export default App;
