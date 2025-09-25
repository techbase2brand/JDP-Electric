import { useSelector } from "react-redux";

const useHasPermission = (moduleName, actionType = "view") => {
   const permissions = useSelector(state => state.user.permissions);
  // auth.permissions aapke persist state me hai

  return permissions?.some(
    (perm) =>
      perm.module === moduleName &&
      perm.action === actionType &&
      perm.allowed
  );
};

export default useHasPermission;
