import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, User, Mail, ShieldCheck } from 'lucide-react';
import { 
  useGetUserDetailsQuery, 
  useUpdateUserMutation 
} from '../../slices/usersApiSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin }).unwrap();
      alert('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      console.error(err?.data?.message || err.error);
      alert(err?.data?.message || err.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <div>
        <Button
          variant="ghost"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <Link to="/admin/userlist">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
          Edit User Account
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update the profile details and system privileges for this customer account
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse text-sm">Loading account details...</p>
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-6 text-destructive-foreground">
            <span className="font-semibold text-sm">Error:</span>
            <span className="text-sm">{error?.data?.message || error.error}</span>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>Configure credentials and administrator controls</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-muted/20 border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-muted/20 border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 py-3 border-t border-border/40 mt-6">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="w-5 h-5 bg-muted/20 border border-border rounded text-primary focus:ring-primary focus:ring-offset-background transition-colors cursor-pointer"
                />
                <label htmlFor="isAdmin" className="text-sm font-semibold text-foreground cursor-pointer select-none">
                  Grant Administrator Privileges
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingUpdate}
                  onClick={() => navigate('/admin/userlist')}
                  className="px-5 rounded-xl border-border text-foreground hover:bg-muted/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loadingUpdate}
                  className="px-6 rounded-xl font-semibold shadow-lg shadow-primary/20 gap-2"
                >
                  {loadingUpdate && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default UserEditScreen;
