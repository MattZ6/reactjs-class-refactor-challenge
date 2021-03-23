import { useCallback, useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import Modal from '../Modal';
import Input from '../Input';

import { Form } from './styles';

interface IFood {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

interface IUpdateFood {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IModalEditFoodProps {
  isOpen: boolean;
  setIsOpen: () => void;
  editingFood: IFood | undefined;
  handleUpdateFood: (food: IUpdateFood) => Promise<void>;
}


function ModalEditFood({ isOpen, setIsOpen, editingFood, handleUpdateFood }: IModalEditFoodProps) {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: IUpdateFood) => {
    await handleUpdateFood(data);

    setIsOpen();
  }, [setIsOpen, handleUpdateFood]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
