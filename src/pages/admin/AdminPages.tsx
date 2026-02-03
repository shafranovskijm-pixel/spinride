import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllPageContent, useUpdatePageContent, PageContent } from "@/hooks/use-page-content";
import { Loader2, Save, FileText, Truck, Info, Phone, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_ICONS: Record<string, typeof FileText> = {
  warranty: FileText,
  delivery: Truck,
  about: Info,
  contacts: Phone,
};

const PAGE_LABELS: Record<string, string> = {
  warranty: "Гарантия",
  delivery: "Доставка",
  about: "О нас",
  contacts: "Контакты",
};

function WarrantyEditor({ page, onSave, isSaving }: { page: PageContent; onSave: (data: Partial<PageContent>) => void; isSaving: boolean }) {
  const [title, setTitle] = useState(page.title);
  const [subtitle, setSubtitle] = useState(page.subtitle || "");
  const content = page.content as any;
  
  const [warrantyPeriods, setWarrantyPeriods] = useState(content.warranty_periods || []);
  const [coverage, setCoverage] = useState(content.coverage || []);
  const [requirements, setRequirements] = useState(content.requirements || []);
  const [exclusions, setExclusions] = useState(content.exclusions || []);
  const [contactPhone, setContactPhone] = useState(content.contact_phone || "");
  const [contactEmail, setContactEmail] = useState(content.contact_email || "");
  const [processingNote, setProcessingNote] = useState(content.processing_note || "");

  const handleSave = () => {
    onSave({
      id: page.id,
      title,
      subtitle,
      content: {
        warranty_periods: warrantyPeriods,
        coverage,
        requirements,
        exclusions,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        processing_note: processingNote,
      },
    });
  };

  const updateWarrantyPeriod = (index: number, field: string, value: string) => {
    const updated = [...warrantyPeriods];
    updated[index] = { ...updated[index], [field]: value };
    setWarrantyPeriods(updated);
  };

  const addWarrantyPeriod = () => {
    setWarrantyPeriods([...warrantyPeriods, { category: "", period: "" }]);
  };

  const removeWarrantyPeriod = (index: number) => {
    setWarrantyPeriods(warrantyPeriods.filter((_: any, i: number) => i !== index));
  };

  const updateListItem = (list: string[], setList: (list: string[]) => void, index: number, value: string) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const addListItem = (list: string[], setList: (list: string[]) => void) => {
    setList([...list, ""]);
  };

  const removeListItem = (list: string[], setList: (list: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Заголовок</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Подзаголовок</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Сроки гарантии</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {warrantyPeriods.map((item: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Категория"
                value={item.category}
                onChange={(e) => updateWarrantyPeriod(index, "category", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Срок"
                value={item.period}
                onChange={(e) => updateWarrantyPeriod(index, "period", e.target.value)}
                className="w-32"
              />
              <Button variant="ghost" size="icon" onClick={() => removeWarrantyPeriod(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addWarrantyPeriod}>
            <Plus className="h-4 w-4 mr-1" /> Добавить
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Что покрывает гарантия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {coverage.map((item: string, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={item}
                  onChange={(e) => updateListItem(coverage, setCoverage, index, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => removeListItem(coverage, setCoverage, index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addListItem(coverage, setCoverage)}>
              <Plus className="h-4 w-4 mr-1" /> Добавить
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Для обращения необходимо</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {requirements.map((item: string, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={item}
                  onChange={(e) => updateListItem(requirements, setRequirements, index, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => removeListItem(requirements, setRequirements, index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addListItem(requirements, setRequirements)}>
              <Plus className="h-4 w-4 mr-1" /> Добавить
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Гарантия не распространяется на</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {exclusions.map((item: string, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={item}
                onChange={(e) => updateListItem(exclusions, setExclusions, index, e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={() => removeListItem(exclusions, setExclusions, index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addListItem(exclusions, setExclusions)}>
            <Plus className="h-4 w-4 mr-1" /> Добавить
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Контакты для обращения</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Телефон</Label>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Примечание о сроках рассмотрения</Label>
            <Textarea value={processingNote} onChange={(e) => setProcessingNote(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Сохранить
      </Button>
    </div>
  );
}

function DeliveryEditor({ page, onSave, isSaving }: { page: PageContent; onSave: (data: Partial<PageContent>) => void; isSaving: boolean }) {
  const [title, setTitle] = useState(page.title);
  const [subtitle, setSubtitle] = useState(page.subtitle || "");
  const content = page.content as any;
  
  const [methods, setMethods] = useState(content.methods || []);
  const [freeThreshold, setFreeThreshold] = useState(content.free_delivery_threshold || 0);
  const [pickupAddress, setPickupAddress] = useState(content.pickup_address || "");
  const [pickupHours, setPickupHours] = useState(content.pickup_hours || "");

  const handleSave = () => {
    onSave({
      id: page.id,
      title,
      subtitle,
      content: {
        methods,
        free_delivery_threshold: freeThreshold,
        pickup_address: pickupAddress,
        pickup_hours: pickupHours,
      },
    });
  };

  const updateMethod = (index: number, field: string, value: string) => {
    const updated = [...methods];
    updated[index] = { ...updated[index], [field]: value };
    setMethods(updated);
  };

  const addMethod = () => {
    setMethods([...methods, { name: "", price: "", time: "" }]);
  };

  const removeMethod = (index: number) => {
    setMethods(methods.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Заголовок</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Подзаголовок</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Способы доставки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {methods.map((item: any, index: number) => (
            <div key={index} className="flex gap-2 items-center flex-wrap">
              <Input
                placeholder="Название"
                value={item.name}
                onChange={(e) => updateMethod(index, "name", e.target.value)}
                className="flex-1 min-w-[150px]"
              />
              <Input
                placeholder="Цена"
                value={item.price}
                onChange={(e) => updateMethod(index, "price", e.target.value)}
                className="w-32"
              />
              <Input
                placeholder="Срок"
                value={item.time}
                onChange={(e) => updateMethod(index, "time", e.target.value)}
                className="w-32"
              />
              <Button variant="ghost" size="icon" onClick={() => removeMethod(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addMethod}>
            <Plus className="h-4 w-4 mr-1" /> Добавить способ
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Самовывоз</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Адрес самовывоза</Label>
              <Input value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />
            </div>
            <div>
              <Label>Часы работы</Label>
              <Input value={pickupHours} onChange={(e) => setPickupHours(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Бесплатная доставка от (₽)</Label>
            <Input
              type="number"
              value={freeThreshold}
              onChange={(e) => setFreeThreshold(Number(e.target.value))}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Сохранить
      </Button>
    </div>
  );
}

function AboutEditor({ page, onSave, isSaving }: { page: PageContent; onSave: (data: Partial<PageContent>) => void; isSaving: boolean }) {
  const [title, setTitle] = useState(page.title);
  const [subtitle, setSubtitle] = useState(page.subtitle || "");
  const content = page.content as any;
  
  const [description, setDescription] = useState(content.description || "");
  const [features, setFeatures] = useState(content.features || []);
  const [history, setHistory] = useState(content.history || "");

  const handleSave = () => {
    onSave({
      id: page.id,
      title,
      subtitle,
      content: { description, features, history },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Заголовок</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Подзаголовок</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
      </div>

      <div>
        <Label>Описание</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px]" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Преимущества</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {features.map((item: string, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={item}
                onChange={(e) => {
                  const updated = [...features];
                  updated[index] = e.target.value;
                  setFeatures(updated);
                }}
              />
              <Button variant="ghost" size="icon" onClick={() => setFeatures(features.filter((_: any, i: number) => i !== index))}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setFeatures([...features, ""])}>
            <Plus className="h-4 w-4 mr-1" /> Добавить
          </Button>
        </CardContent>
      </Card>

      <div>
        <Label>История компании</Label>
        <Textarea value={history} onChange={(e) => setHistory(e.target.value)} className="min-h-[80px]" />
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Сохранить
      </Button>
    </div>
  );
}

function ContactsEditor({ page, onSave, isSaving }: { page: PageContent; onSave: (data: Partial<PageContent>) => void; isSaving: boolean }) {
  const [title, setTitle] = useState(page.title);
  const [subtitle, setSubtitle] = useState(page.subtitle || "");
  const content = page.content as any;
  
  const [address, setAddress] = useState(content.address || "");
  const [phone, setPhone] = useState(content.phone || "");
  const [email, setEmail] = useState(content.email || "");
  const [workHours, setWorkHours] = useState(content.work_hours || "");
  const [social, setSocial] = useState(content.social || {});

  const handleSave = () => {
    onSave({
      id: page.id,
      title,
      subtitle,
      content: { address, phone, email, work_hours: workHours, social },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Заголовок</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Подзаголовок</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Адрес</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <Label>Телефон</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Часы работы</Label>
              <Input value={workHours} onChange={(e) => setWorkHours(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Социальные сети</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Telegram</Label>
            <Input
              value={social.telegram || ""}
              onChange={(e) => setSocial({ ...social, telegram: e.target.value })}
              placeholder="https://t.me/..."
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
            <Label>ВКонтакте</Label>
            <Input
              value={social.vk || ""}
              onChange={(e) => setSocial({ ...social, vk: e.target.value })}
              placeholder="https://vk.com/..."
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Сохранить
      </Button>
    </div>
  );
}

export default function AdminPages() {
  const { data: pages, isLoading } = useAllPageContent();
  const updateMutation = useUpdatePageContent();

  const handleSave = (data: Partial<PageContent>) => {
    updateMutation.mutate({
      id: data.id!,
      title: data.title!,
      subtitle: data.subtitle || null,
      content: data.content,
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Страницы" subtitle="Редактирование контента статических страниц">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AdminLayout>
    );
  }

  const pageMap = pages?.reduce((acc, page) => {
    acc[page.page_key] = page;
    return acc;
  }, {} as Record<string, PageContent>) || {};

  return (
    <AdminLayout title="Страницы" subtitle="Редактирование контента статических страниц">
      <Tabs defaultValue="warranty" className="w-full">
        <TabsList className="mb-4 flex-wrap h-auto gap-1">
          {["warranty", "delivery", "about", "contacts"].map((key) => {
            const Icon = PAGE_ICONS[key];
            return (
              <TabsTrigger key={key} value={key} className="gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{PAGE_LABELS[key]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="warranty">
          {pageMap.warranty ? (
            <WarrantyEditor page={pageMap.warranty} onSave={handleSave} isSaving={updateMutation.isPending} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Контент страницы не найден
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="delivery">
          {pageMap.delivery ? (
            <DeliveryEditor page={pageMap.delivery} onSave={handleSave} isSaving={updateMutation.isPending} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Контент страницы не найден
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="about">
          {pageMap.about ? (
            <AboutEditor page={pageMap.about} onSave={handleSave} isSaving={updateMutation.isPending} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Контент страницы не найден
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contacts">
          {pageMap.contacts ? (
            <ContactsEditor page={pageMap.contacts} onSave={handleSave} isSaving={updateMutation.isPending} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Контент страницы не найден
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
