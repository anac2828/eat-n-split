import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);

  // Show/hide add friend form.
  const handleShowAddFriend = () => setShowAddFriend((show) => !show);

  // Adds the new friend and closes form after friend is added.
  const handleAddFriend = (newfriend) => {
    setFriends((currentfriends) => [...currentfriends, newfriend]);
    setShowAddFriend(false);
  };

  //Opens/closes Split bill form and sets the selected friend
  const handleSelection = (selectedFriend) => {
    // curFriend = selectedFriend useState.
    // If id's match form will close and no friend is selected.
    // If id's don't match form will open and the selectedFriend will be the selectedFriend state will be updated.
    setSelectedFriend((curFriend) =>
      curFriend?.id === selectedFriend.id ? null : selectedFriend
    );
    // Closes the add friend form
    setShowAddFriend(false);
  };

  const handleSplitBill = (value) => {
    // ADD value from split bill form to friends balance
    setFriends(
      friends.map((friend) =>
        // Update the selected friend's balance and create a new array of objects
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    // Closes Split bill form
    setSelectedFriend(null);
  };

  return (
    <>
      <h1>Bill calculator</h1>
      <div className='app'>
        <aside className='sidebar'>
          <FriendsList
            friends={friends}
            currentSelectedFriend={selectedFriend}
            onSelection={handleSelection}
          />
          {/* ADD FRIEND FORM */}
          {/* If showAddFriend is true display Add friend form */}
          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
          {/* The Button component does not have a native onClick function. Add onClick to make button interactive. */}

          {/* Button controls the Add friend form */}
          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? 'Close' : 'Add friend'}
          </Button>
        </aside>

        {/* SPLIT BILL FORM - will show when the select button in the FriendList is clicked*/}
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}
      </div>
    </>
  );
}

function FriendsList({ friends, onSelection, currentSelectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          currentSelectedFriend={currentSelectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, currentSelectedFriend }) {
  // friend is from the initial state. If id's match controlls styles on the selected friend
  const isSelected = currentSelectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {/* Who owes money info */}
      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      {/* Controls the Split bill form and passes the friend data */}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    // `${image}?=${id}` creates a unit image for the new friend that will always be the same.
    const newFriend = { name, image: `${image}?=${id}`, balance: 0, id };

    onAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  };
  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🏞️Image URL</label>
      <input
        type='text'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      {/* Add friend button */}
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');
  const paidByFriend = bill ? bill - paidByUser : '';

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    // If user pays value = paidByFriend else value = paidByUser. Value will be store in friends balance.
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  }

  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      {/* BILL TOTAL */}
      <label>💵 Bill value</label>
      <input
        type='text'
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      {/* PAID BY YOU */}
      <label>🧍‍♀️ Your expense</label>
      <input
        type='text'
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            // This will prevent the value of paidByUser to be more than the total bill
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      {/* PAID BY FRIEND */}
      <label>👫 {selectedFriend.name}'s expense</label>
      <input type='text' value={paidByFriend} disabled />

      {/* WHO PAID THE BILL */}
      <label>💵 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>
      {/* SPLIT BILL BUTTON */}
      <Button>Split bill</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  );
}
