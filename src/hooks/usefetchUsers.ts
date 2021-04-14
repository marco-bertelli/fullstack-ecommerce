import { useEffect, useState } from "react";
import { snapshotToDoc, userCountsRef, usersRef } from "../firebase";
import { isAdmin } from "../helpers";
import { UserInfo } from "../types";
import { useAsyncCall } from "./useAsyncCall";

export const useFetchUsers = (userInfo: UserInfo | null) => {
  const { loading, setLoading, error, setError } = useAsyncCall();
  const [users, setUsers] = useState<UserInfo[] | null>(null);
  const [userCounts, setUserCounts] = useState(0);

  // ottengo tutti gli utenti
  useEffect(() => {
    if (!userInfo || !isAdmin(userInfo.role)) {
      setUsers(null);
      return;
    }

    setLoading(true);

    const unsubscribe = usersRef.orderBy("createdAT", "desc").onSnapshot({
      next: (snapshots) => {
          const users :UserInfo[] = []
          snapshots.forEach(snapshot=>{
              const user = snapshotToDoc<UserInfo>(snapshot)
              users.push(user)
            })

            setUsers(users)
            setLoading(false)
      },
      error: (err) => {
        setError(err.message);
        setUsers(null);
        setLoading(false);
      },
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  // recuper user-counts/counts
  useEffect(() => {
      if(!userInfo || !isAdmin(userInfo.role)) {
          setUserCounts(0)
          return
      }

      setLoading(true)

      const unsubscribe = userCountsRef.doc('counts').onSnapshot({
        next: (snapshot) => {
            const {usersCounts} = snapshot.data() as {usersCounts: number}
            setUserCounts(usersCounts)
            setLoading(false)
        },
        error: (err) => {
          setError(err.message);
          setUserCounts(0);
          setLoading(false);
        },
      })
      return () => unsubscribe()

      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userInfo])

  return {users, userCounts, loading, error}
};
