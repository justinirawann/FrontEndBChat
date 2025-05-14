import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    setUser(userData);
    // console.log("Nama:", userData.name);
    // console.log("Email:", userData.email);
  } else {
    console.error("Tidak ada user di localStorage");
  }
}, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Halo, {user.name}!</h1>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
