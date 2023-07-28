
  import React, { useState } from 'react';
import './App.css';
import WordModal from './WordSelector';

const phrasesA = [
  'O rato roeu a roupa do rei de roma',
  'Sempre faça o que te faz bem',
  'Competir é fazer diferente',
  'Comprar é um ato de sobrevivência',
];

const phrasesB = [
  'Esta é a frase da coluna B 1',
  'Esta é a frase da coluna B 2',
  'Esta é a frase da coluna B 3',
  'Esta é a frase da coluna B 4',
];

function Tabela() {
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>(new Array(phrasesA.length).fill(''));
  const [selectedColumn, setSelectedColumn] = useState('A');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);

  const handleSelectColumn = (column: string) => {
    setSelectedColumn(column);
    setSelectedPhrases(new Array(phrasesA.length).fill(''));
  };

  const handleSelectButtonClick = (rowIndex: number) => {
    setCurrentRowIndex(rowIndex);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = (selectedWords: string[]) => {
    if (currentRowIndex !== null) {
      const updatedSelectedPhrases = [...selectedPhrases];
      updatedSelectedPhrases[currentRowIndex] = selectedWords.join(' ');
      setSelectedPhrases(updatedSelectedPhrases);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="App">
      <div className="column-buttons">
        
        
      </div>
      <table>
        <thead>
          <tr>
            <th>Coluna A <button onClick={() => handleSelectColumn('A')}>Selecionar Coluna A</button></th>
            <th>Coluna B <button onClick={() => handleSelectColumn('B')}>Selecionar Coluna B</button></th>
            <th>Coluna C</th>
          </tr>
        </thead>
        <tbody>
          {phrasesA.map((phraseA, index) => (
            <tr key={index}>
              <td>{phraseA}</td>
              <td>{phrasesB[index]}</td>
              <td className="cell-with-button">
              <button className="floating-button" onClick={() => handleSelectButtonClick(index)}>
                    +
                  </button>
                {selectedPhrases[index]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentRowIndex !== null && (
        <WordModal
          phrase={selectedColumn === 'A' ? phrasesA[currentRowIndex] : phrasesB[currentRowIndex]}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default Tabela;
