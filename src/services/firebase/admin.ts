
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './config';

export const clearAllCollisions = async () => {
    console.log('Clearing all collisions...');
    const q = query(collection(db, 'collisions'));
    const snapshot = await getDocs(q);
    
    console.log(`Found ${snapshot.size} collisions to delete.`);
    
    const promises = snapshot.docs.map(d => deleteDoc(doc(db, 'collisions', d.id)));
    await Promise.all(promises);
    
    console.log('All collisions cleared.');
};
