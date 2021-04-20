import { useEffect, useState } from "react";
import { snapshotToDoc, userCountsRef, usersRef } from "../firebase";
import { isAdmin } from "../helpers";
import { UserInfo } from "../types";
import { useAsyncCall } from "./useAsyncCall";
import { firebase } from "../firebase/config";

const userQueryLimit = 30;

export const useFetchUsers = (userInfo: UserInfo | null) => {
  const { loading, setLoading, error, setError } = useAsyncCall();
  const [users, setUsers] = useState<UserInfo[] | null>(null);
  const [userCounts, setUserCounts] = useState(0);
  const [
    lastDocument,
    setLastdocument,
  ] = useState<firebase.firestore.DocumentData>();

  // query per ottenere più utenti
  const queryMoreUsers = async () => {
    try {
      if (!lastDocument) return;

      setLoading(true);

      const snapshots = await usersRef
        .orderBy("createdAT", "desc")
        .startAfter(lastDocument)
        .limit(userQueryLimit)
        .get();

      const newUsers = snapshots.docs.map((snapshot) =>
        snapshotToDoc<UserInfo>(snapshot)
      );

      const lastVisible = snapshots.docs[snapshots.docs.length - 1];
      setLastdocument(lastVisible);

      // combino con i nuovi utenti
      setUsers((prev) => prev ? [...prev,...newUsers] : newUsers);
      setLoading(false);
    } catch (error) {
      const {message} = error as {message:string}
      setError(message)
      setLoading(false)

      return false
    }
  };

  // ottengo tutti gli utenti
  useEffect(() => {
    if (!userInfo || !isAdmin(userInfo.role)) {
      setUsers(null);
      return;
    }

    setLoading(true);

    const unsubscribe = usersRef
      .orderBy("createdAT", "desc")
      .limit(userQueryLimit)
      .onSnapshot({
        next: (snapshots) => {
          const users = snapshots.docs.map((snapshot) =>
            snapshotToDoc<UserInfo>(snapshot)
          );

          const lastVisible = snapshots.docs[snapshots.docs.length - 1];
          setLastdocument(lastVisible);

          setUsers(users);
          setLoading(false);
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
    if (!userInfo || !isAdmin(userInfo.role)) {
      setUserCounts(0);
      return;
    }

    setLoading(true);

    const unsubscribe = userCountsRef.doc("counts").onSnapshot({
      next: (snapshot) => {
        const { usersCounts } = snapshot.data() as { usersCounts: number };
        setUserCounts(usersCounts);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setUserCounts(0);
        setLoading(false);
      },
    });
    return () => unsubscribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return { users, userCounts, loading, error, queryMoreUsers };
};
