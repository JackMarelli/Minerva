import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './routes/Landing/Landing';
import Editor from './routes/Editor/Editor';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/document/:id" element={<Editor />} />
        </Routes>
    </Router>
  );
}

export default App;
