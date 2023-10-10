import PrintButton from './components/printbutton';
function App() {
  return (
    <div className=" h-screen w-full flex items-center justify-center p-5">
      <a href="/graph">
        <PrintButton btnText="Print" />
      </a>
    </div>
  );
}

export default App;
