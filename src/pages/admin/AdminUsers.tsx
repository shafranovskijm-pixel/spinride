import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  UserCog,
  Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  email?: string;
  roles: AppRole[];
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "add" | "remove";
    userId: string;
    role: AppRole;
    userName: string;
  } | null>(null);

  // Fetch profiles with their roles
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles: UserWithRole[] = profiles.map((profile) => ({
        ...profile,
        roles: userRoles
          .filter((r) => r.user_id === profile.user_id)
          .map((r) => r.role),
      }));

      return usersWithRoles;
    },
  });

  // Add role mutation
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Роль успешно добавлена");
    },
    onError: (error) => {
      console.error("Error adding role:", error);
      toast.error("Ошибка при добавлении роли");
    },
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Роль успешно удалена");
    },
    onError: (error) => {
      console.error("Error removing role:", error);
      toast.error("Ошибка при удалении роли");
    },
  });

  const handleConfirmAction = () => {
    if (!confirmDialog) return;

    if (confirmDialog.type === "add") {
      addRoleMutation.mutate({
        userId: confirmDialog.userId,
        role: confirmDialog.role,
      });
    } else {
      removeRoleMutation.mutate({
        userId: confirmDialog.userId,
        role: confirmDialog.role,
      });
    }
    setConfirmDialog(null);
  };

  // Filter users by search
  const filteredUsers = users?.filter((user) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      user.display_name?.toLowerCase().includes(searchLower) ||
      user.user_id.toLowerCase().includes(searchLower)
    );
  });

  const roleLabels: Record<AppRole, string> = {
    admin: "Администратор",
    moderator: "Модератор",
    user: "Пользователь",
  };

  const roleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "default";
      case "moderator":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getInitials = (name: string | null, id: string) => {
    if (name) {
      return name.slice(0, 2).toUpperCase();
    }
    return id.slice(0, 2).toUpperCase();
  };

  return (
    <AdminLayout
      title="Пользователи"
      subtitle={`${users?.length || 0} пользователей`}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Администраторы</CardTitle>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.filter((u) => u.roles.includes("admin")).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Модераторы</CardTitle>
              <Shield className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.filter((u) => u.roles.includes("moderator")).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск пользователей..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Роли</TableHead>
                    <TableHead className="hidden sm:table-cell">Дата регистрации</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Пользователи не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {getInitials(user.display_name, user.user_id)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {user.display_name || "Без имени"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {user.user_id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.length > 0 ? (
                              user.roles.map((role) => (
                                <Badge key={role} variant={roleBadgeVariant(role)}>
                                  {roleLabels[role]}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                Без ролей
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {format(new Date(user.created_at), "d MMM yyyy", { locale: ru })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Управление ролями</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              
                              {/* Admin role toggle */}
                              {user.roles.includes("admin") ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmDialog({
                                      open: true,
                                      type: "remove",
                                      userId: user.user_id,
                                      role: "admin",
                                      userName: user.display_name || "пользователя",
                                    })
                                  }
                                  className="text-destructive"
                                >
                                  <ShieldX className="h-4 w-4 mr-2" />
                                  Снять администратора
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmDialog({
                                      open: true,
                                      type: "add",
                                      userId: user.user_id,
                                      role: "admin",
                                      userName: user.display_name || "пользователя",
                                    })
                                  }
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Назначить администратором
                                </DropdownMenuItem>
                              )}

                              {/* Moderator role toggle */}
                              {user.roles.includes("moderator") ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmDialog({
                                      open: true,
                                      type: "remove",
                                      userId: user.user_id,
                                      role: "moderator",
                                      userName: user.display_name || "пользователя",
                                    })
                                  }
                                  className="text-destructive"
                                >
                                  <ShieldX className="h-4 w-4 mr-2" />
                                  Снять модератора
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmDialog({
                                      open: true,
                                      type: "add",
                                      userId: user.user_id,
                                      role: "moderator",
                                      userName: user.display_name || "пользователя",
                                    })
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Назначить модератором
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog?.open}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog?.type === "add" ? "Добавить роль?" : "Удалить роль?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog?.type === "add"
                ? `Вы уверены, что хотите назначить ${confirmDialog?.userName} роль "${roleLabels[confirmDialog?.role || "user"]}"?`
                : `Вы уверены, что хотите снять с ${confirmDialog?.userName} роль "${roleLabels[confirmDialog?.role || "user"]}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {confirmDialog?.type === "add" ? "Назначить" : "Снять"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
