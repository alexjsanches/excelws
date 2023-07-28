import React, { useState, useEffect } from 'react';

interface WordModalProps {
  phrase: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedWords: string[]) => void;
}

const WordModal: React.FC<WordModalProps> = ({ phrase, isOpen, onClose, onSave }) => {
  const words = phrase.split(' ');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    setSelectedWords([]);
  }, [phrase]);

  const handleWordSelection = (word: string) => {
    setSelectedWords((prevSelected) =>
      prevSelected.includes(word)
        ? prevSelected.filter((w) => w !== word)
        : [...prevSelected, word]
    );
  };

  const handleSaveSelection = () => {
    onSave(selectedWords);
    onClose();
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Selecione as palavras:</h2>
        <div className="word-selector-container">
          {words.map((word, index) => (
            <span
              key={index}
              className={`word-bubble ${selectedWords.includes(word) ? 'selected' : ''}`}
              onClick={() => handleWordSelection(word)}
            >
              {word}
            </span>
          ))}
        </div>
        <button onClick={handleSaveSelection}>Confirmar Escolha</button>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  ) : null;
};

export default WordModal;
