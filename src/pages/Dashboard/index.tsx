import { useCallback, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFood {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

interface ICreateFood {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IUpdateFood {
  name: string;
  image: string;
  price: string;
  description: string;
}

function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      try {
        const { data } = await api.get<IFood[]>('/foods');

        setFoods(data);
      } catch (error) {
        console.log(error);
      }
    }

    loadFoods();
  }, []);

  const handleAddFood = useCallback(async (food: ICreateFood) => {
    try {
      const { data } = await api.post<IFood>('/foods', {
        ...food,
        available: true,
      });

      setFoods(state => [...state, data]);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleUpdateFood = useCallback(async (food: IUpdateFood) => {
    if (!editingFood) {
      return;
    }

    try {
      const { data } = await api.put<IFood>(
        `/foods/${editingFood.id}`,
        {
          ...editingFood,
          ...food
        },
      );

      setFoods(state => state.map(f => f.id === data.id ? data : f));
    } catch (err) {
      console.log(err);
    }
  }, [editingFood]);

  const handleDeleteFood = useCallback(async (id: number) => {
    try {
      await api.delete<void>(`/foods/${id}`);

      setFoods(state => state.filter(f => f.id !== id));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const toggleModal = useCallback(() => {
    setModalOpen(state => !state);
  }, []);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(state => !state);
  }, []);

  const handleEditFood = useCallback((food: IFood) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />

      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />

      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
