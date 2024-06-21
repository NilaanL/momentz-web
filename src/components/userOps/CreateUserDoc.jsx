import React, { useEffect } from 'react';
import { doc, setDoc,getDoc } from 'firebase/firestore';
import { db, auth } from '../../dbConfig/firebase';

function CreateUserDocument() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Check if the user document already exists
          const userRef = doc(db, 'Users', user.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            // Create user document if it doesn't exist
            await setDoc(userRef, {
              id: user.uid,
              google_id: user.providerData[0].uid, 
              name: user.displayName,
              email: user.email,
              profile_picture: user.photoURL, // Get profile picture URL if available
            });
            console.log('User document created');
          }
        } catch (error) {
          console.error('Error creating user document:', error);
        }
      }
    });

    return () => unsubscribe(); 
  }, []);

  return null; 
}

export default CreateUserDocument;
