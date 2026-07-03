import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Mail, Check, X, Edit, Trash2, Loader2, ShieldCheck, User } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        console.error(err?.data?.message || err.error);
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Users Management
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage user accounts, update profile privileges, and oversee system authorization
        </p>
      </div>

      {loadingDelete && (
        <Card className="border-warning/30 bg-warning/10">
          <CardContent className="flex items-center gap-3 p-4">
            <Loader2 className="h-5 w-5 animate-spin text-warning" />
            <span className="text-sm font-medium text-warning-foreground">Deleting user account...</span>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse text-sm">Loading user directory...</p>
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-6 text-destructive-foreground">
            <span className="font-semibold text-sm">Error:</span>
            <span className="text-sm">{error?.data?.message || error.error}</span>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/30 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="px-6 py-4">ID</th>
                    <th scope="col" className="px-6 py-4">Name</th>
                    <th scope="col" className="px-6 py-4">Email</th>
                    <th scope="col" className="px-6 py-4">Role</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-sm">
                  {users.map((userItem, idx) => (
                    <motion.tr
                      key={userItem._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-muted/10 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {userItem._id}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {userItem.name}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${userItem.email}`}
                          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {userItem.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {userItem.isAdmin ? (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 gap-1 font-medium">
                            <ShieldCheck className="h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground border-border/60 hover:bg-muted/30 gap-1 font-medium">
                            <User className="h-3 w-3 text-muted-foreground" />
                            Customer
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Link to={`/admin/user/${userItem._id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHandler(userItem._id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            disabled={userItem.isAdmin}
                            title={userItem.isAdmin ? "Cannot delete admin users" : "Delete user"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                        No registered users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default UserListScreen;
