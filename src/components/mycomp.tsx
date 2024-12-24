// In a React component (e.g., MyComponent.tsx)
import { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    // Sending a GET request
    fetch('')
      .then((response) => response.json())
      .then((data) => console.log(data)); // Output: { message: 'This is a GET request' }
  }, []);

  return <div>Check the console for GET response</div>;
};

export default MyComponent;
