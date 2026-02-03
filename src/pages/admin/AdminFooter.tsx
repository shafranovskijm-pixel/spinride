import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useFooterSettings, useUpdateFooterSettings, FooterSettings } from "@/hooks/use-footer-settings";
import { Loader2, Save, Plus, Trash2, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminFooter() {
  const { data: settings, isLoading } = useFooterSettings();
  const { mutate: updateSettings, isPending: isSaving } = useUpdateFooterSettings();

  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [copyrightText, setCopyrightText] = useState("");
  const [social, setSocial] = useState<FooterSettings["social"]>({});
  const [catalogLinks, setCatalogLinks] = useState<FooterSettings["catalog_links"]>([]);
  const [infoLinks, setInfoLinks] = useState<FooterSettings["info_links"]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize state when data loads
  if (settings && !initialized) {
    setDescription(settings.description);
    setPhone(settings.phone);
    setAddress(settings.address);
    setEmail(settings.email);
    setWorkHours(settings.work_hours);
    setCopyrightText(settings.copyright_text);
    setSocial(settings.social);
    setCatalogLinks(settings.catalog_links);
    setInfoLinks(settings.info_links);
    setInitialized(true);
  }

  const handleSave = () => {
    updateSettings({
      description,
      phone,
      address,
      email,
      work_hours: workHours,
      copyright_text: copyrightText,
      social,
      catalog_links: catalogLinks,
      info_links: infoLinks,
    });
  };

  // Catalog links
  const updateCatalogLink = (index: number, field: string, value: string) => {
    const updated = [...catalogLinks];
    updated[index] = { ...updated[index], [field]: value };
    setCatalogLinks(updated);
  };

  const addCatalogLink = () => {
    setCatalogLinks([...catalogLinks, { title: "", url: "" }]);
  };

  const removeCatalogLink = (index: number) => {
    setCatalogLinks(catalogLinks.filter((_, i) => i !== index));
  };

  // Info links
  const updateInfoLink = (index: number, field: string, value: string | boolean) => {
    const updated = [...infoLinks];
    updated[index] = { ...updated[index], [field]: value };
    setInfoLinks(updated);
  };

  const addInfoLink = () => {
    setInfoLinks([...infoLinks, { title: "", url: "", highlight: false }]);
  };

  const removeInfoLink = (index: number) => {
    setInfoLinks(infoLinks.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <AdminLayout title="Футер">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Футер" subtitle="Настройте содержимое футера сайта">
      <div className="space-y-6 max-w-4xl">
        {/* Main info */}
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Описание компании</Label>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Краткое описание для футера"
                className="min-h-[80px]"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Телефон</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>Адрес</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <Label>Часы работы</Label>
                <Input value={workHours} onChange={(e) => setWorkHours(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Текст копирайта</Label>
              <Input 
                value={copyrightText} 
                onChange={(e) => setCopyrightText(e.target.value)} 
                placeholder="SPINRIDE. Все права защищены."
              />
            </div>
          </CardContent>
        </Card>

        {/* Social links */}
        <Card>
          <CardHeader>
            <CardTitle>Социальные сети</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Telegram</Label>
                <Input 
                  value={social.telegram || ""} 
                  onChange={(e) => setSocial({ ...social, telegram: e.target.value })} 
                  placeholder="https://t.me/..."
                />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input 
                  value={social.instagram || ""} 
                  onChange={(e) => setSocial({ ...social, instagram: e.target.value })} 
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input 
                  value={social.whatsapp || ""} 
                  onChange={(e) => setSocial({ ...social, whatsapp: e.target.value })} 
                  placeholder="https://wa.me/..."
                />
              </div>
              <div>
                <Label>VK</Label>
                <Input 
                  value={social.vk || ""} 
                  onChange={(e) => setSocial({ ...social, vk: e.target.value })} 
                  placeholder="https://vk.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Catalog links */}
        <Card>
          <CardHeader>
            <CardTitle>Ссылки каталога</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {catalogLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Название"
                  value={link.title}
                  onChange={(e) => updateCatalogLink(index, "title", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="URL (например: /catalog/bicycles)"
                  value={link.url}
                  onChange={(e) => updateCatalogLink(index, "url", e.target.value)}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => removeCatalogLink(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addCatalogLink}>
              <Plus className="h-4 w-4 mr-1" /> Добавить ссылку
            </Button>
          </CardContent>
        </Card>

        {/* Info links */}
        <Card>
          <CardHeader>
            <CardTitle>Информационные ссылки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {infoLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-center flex-wrap">
                <Input
                  placeholder="Название"
                  value={link.title}
                  onChange={(e) => updateInfoLink(index, "title", e.target.value)}
                  className="flex-1 min-w-[150px]"
                />
                <Input
                  placeholder="URL (например: /about)"
                  value={link.url}
                  onChange={(e) => updateInfoLink(index, "url", e.target.value)}
                  className="flex-1 min-w-[150px]"
                />
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`highlight-${index}`}
                    checked={link.highlight || false}
                    onCheckedChange={(checked) => updateInfoLink(index, "highlight", !!checked)}
                  />
                  <Label htmlFor={`highlight-${index}`} className="text-sm whitespace-nowrap">
                    Выделить
                  </Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeInfoLink(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addInfoLink}>
              <Plus className="h-4 w-4 mr-1" /> Добавить ссылку
            </Button>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Сохранить
          </Button>
          <Button variant="outline" asChild>
            <a href="/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Посмотреть на сайте
            </a>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
