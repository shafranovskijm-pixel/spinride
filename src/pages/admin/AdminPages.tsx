import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllPageContent, useUpdatePageContent, PageContent } from "@/hooks/use-page-content";
import { Loader2, Save, FileText, Truck, Info, Phone, Plus, Trash2, GripVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const ICON_OPTIONS = [
  { value: "Truck", label: "Грузовик" },
  { value: "MapPin", label: "Локация" },
  { value: "Package", label: "Посылка" },
  { value: "CreditCard", label: "Карта" },
  { value: "Banknote", label: "Наличные" },
  { value: "Shield", label: "Щит" },
  { value: "Award", label: "Награда" },
  { value: "Users", label: "Пользователи" },
];

// ============ WARRANTY EDITOR ============
function WarrantyEditor({ page, onSave, isSaving }: { page: PageContent; onSave: (data: Partial<PageContent> & { id: string }) => void; isSaving: boolean }) {
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

// ============ DELIVERY EDITOR ============
function DeliveryEditor({ page, onSave, isSaving }: { page: PageContent; onSave: (data: Partial<PageContent> & { id: string }) => void; isSaving: boolean }) {
  const [title, setTitle] = useState(page.title);
  const [subtitle, setSubtitle] = useState(page.subtitle || "");
  const content = page.content as any;
  
  const [deliveryMethods, setDeliveryMethods] = useState(content.delivery_methods || []);
  const [paymentMethods, setPaymentMethods] = useState(content.payment_methods || []);
  const [deliveryZones, setDeliveryZones] = useState(content.delivery_zones || []);
  const [faq, setFaq] = useState(content.faq || []);
  const [importantNote, setImportantNote] = useState(content.important_note || "");
  const [contactPhone, setContactPhone] = useState(content.contact_phone || "");
  const [contactHours, setContactHours] = useState(content.contact_hours || "");

  const handleSave = () => {
    onSave({
      id: page.id,
      title,
      subtitle,
      content: {
        delivery_methods: deliveryMethods,
        payment_methods: paymentMethods,
        delivery_zones: deliveryZones,
        faq,
        important_note: importantNote,
        contact_phone: contactPhone,
        contact_hours: contactHours,
      },
    });
  };

  // Delivery methods
  const updateDeliveryMethod = (index: number, field: string, value: any) => {
    const updated = [...deliveryMethods];
    updated[index] = { ...updated[index], [field]: value };
    setDeliveryMethods(updated);
  };

  const addDeliveryMethod = () => {
    setDeliveryMethods([...deliveryMethods, { icon: "Truck", title: "", description: "", details: [], badge: "" }]);
  };

  const removeDeliveryMethod = (index: number) => {
    setDeliveryMethods(deliveryMethods.filter((_: any, i: number) => i !== index));
  };

  const updateDeliveryMethodDetail = (methodIndex: number, detailIndex: number, value: string) => {
    const updated = [...deliveryMethods];
    updated[methodIndex].details[detailIndex] = value;
    setDeliveryMethods(updated);
  };

  const addDeliveryMethodDetail = (methodIndex: number) => {
    const updated = [...deliveryMethods];
    updated[methodIndex].details = [...(updated[methodIndex].details || []), ""];
    setDeliveryMethods(updated);
  };

  const removeDeliveryMethodDetail = (methodIndex: number, detailIndex: number) => {
    const updated = [...deliveryMethods];
    updated[methodIndex].details = updated[methodIndex].details.filter((_: any, i: number) => i !== detailIndex);
    setDeliveryMethods(updated);
  };

  // Payment methods
  const updatePaymentMethod = (index: number, field: string, value: any) => {
    const updated = [...paymentMethods];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentMethods(updated);
  };

  const addPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, { icon: "CreditCard", title: "", description: "", details: "" }]);
  };

  const removePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_: any, i: number) => i !== index));
  };

  // Delivery zones
  const updateDeliveryZone = (index: number, field: string, value: string) => {
    const updated = [...deliveryZones];
    updated[index] = { ...updated[index], [field]: value };
    setDeliveryZones(updated);
  };

  const addDeliveryZone = () => {
    setDeliveryZones([...deliveryZones, { region: "", time: "", price: "" }]);
  };

  const removeDeliveryZone = (index: number) => {
    setDeliveryZones(deliveryZones.filter((_: any, i: number) => i !== index));
  };

  // FAQ
  const updateFaqItem = (index: number, field: string, value: string) => {
    const updated = [...faq];
    updated[index] = { ...updated[index], [field]: value };
    setFaq(updated);
  };

  const addFaqItem = () => {
    setFaq([...faq, { question: "", answer: "" }]);
  };

  const removeFaqItem = (index: number) => {
    setFaq(faq.filter((_: any, i: number) => i !== index));
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

      {/* Delivery Methods */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Способы доставки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliveryMethods.map((method: any, index: number) => (
            <Card key={index} className="p-4 bg-muted/50">
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <Select value={method.icon} onValueChange={(v) => updateDeliveryMethod(index, "icon", v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Название"
                    value={method.title}
                    onChange={(e) => updateDeliveryMethod(index, "title", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Бейдж (опционально)"
                    value={method.badge || ""}
                    onChange={(e) => updateDeliveryMethod(index, "badge", e.target.value)}
                    className="w-32"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeDeliveryMethod(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Input
                  placeholder="Описание"
                  value={method.description}
                  onChange={(e) => updateDeliveryMethod(index, "description", e.target.value)}
                />
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Детали</Label>
                  {method.details?.map((detail: string, detailIndex: number) => (
                    <div key={detailIndex} className="flex gap-2 items-center">
                      <Input
                        value={detail}
                        onChange={(e) => updateDeliveryMethodDetail(index, detailIndex, e.target.value)}
                        placeholder="Деталь"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeDeliveryMethodDetail(index, detailIndex)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addDeliveryMethodDetail(index)}>
                    <Plus className="h-4 w-4 mr-1" /> Добавить деталь
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={addDeliveryMethod}>
            <Plus className="h-4 w-4 mr-1" /> Добавить способ доставки
          </Button>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Способы оплаты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method: any, index: number) => (
            <Card key={index} className="p-4 bg-muted/50">
              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <Select value={method.icon} onValueChange={(v) => updatePaymentMethod(index, "icon", v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Название"
                    value={method.title}
                    onChange={(e) => updatePaymentMethod(index, "title", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removePaymentMethod(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Input
                  placeholder="Короткое описание"
                  value={method.description}
                  onChange={(e) => updatePaymentMethod(index, "description", e.target.value)}
                />
                <Textarea
                  placeholder="Подробное описание"
                  value={method.details}
                  onChange={(e) => updatePaymentMethod(index, "details", e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={addPaymentMethod}>
            <Plus className="h-4 w-4 mr-1" /> Добавить способ оплаты
          </Button>
        </CardContent>
      </Card>

      {/* Delivery Zones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Зоны и сроки доставки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {deliveryZones.map((zone: any, index: number) => (
            <div key={index} className="flex gap-2 items-center flex-wrap">
              <Input
                placeholder="Регион"
                value={zone.region}
                onChange={(e) => updateDeliveryZone(index, "region", e.target.value)}
                className="flex-1 min-w-[150px]"
              />
              <Input
                placeholder="Срок"
                value={zone.time}
                onChange={(e) => updateDeliveryZone(index, "time", e.target.value)}
                className="w-28"
              />
              <Input
                placeholder="Стоимость"
                value={zone.price}
                onChange={(e) => updateDeliveryZone(index, "price", e.target.value)}
                className="w-36"
              />
              <Button variant="ghost" size="icon" onClick={() => removeDeliveryZone(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addDeliveryZone}>
            <Plus className="h-4 w-4 mr-1" /> Добавить зону
          </Button>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Частые вопросы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faq.map((item: any, index: number) => (
            <Card key={index} className="p-4 bg-muted/50">
              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Вопрос"
                    value={item.question}
                    onChange={(e) => updateFaqItem(index, "question", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeFaqItem(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Ответ"
                  value={item.answer}
                  onChange={(e) => updateFaqItem(index, "answer", e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={addFaqItem}>
            <Plus className="h-4 w-4 mr-1" /> Добавить вопрос
          </Button>
        </CardContent>
      </Card>

      {/* Contact & Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Дополнительная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Важное примечание</Label>
            <Textarea
              value={importantNote}
              onChange={(e) => setImportantNote(e.target.value)}
              placeholder="Текст важного примечания"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Контактный телефон</Label>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
            <div>
              <Label>Часы работы</Label>
              <Input value={contactHours} onChange={(e) => setContactHours(e.target.value)} />
            </div>
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

// ============ ABOUT EDITOR ============
function AboutEditor({ page, onSave, isSaving }: { page: PageContent; onSave: (data: Partial<PageContent> & { id: string }) => void; isSaving: boolean }) {
  const [title, setTitle] = useState(page.title);
  const [subtitle, setSubtitle] = useState(page.subtitle || "");
  const content = page.content as any;
  
  const [story, setStory] = useState<string[]>(content.story || []);
  const [features, setFeatures] = useState(content.features || []);
  const [team, setTeam] = useState(content.team || []);
  const [storeImage, setStoreImage] = useState(content.store_image || "");
  const [badgeText, setBadgeText] = useState(content.badge_text || "");
  const [badgeSubtext, setBadgeSubtext] = useState(content.badge_subtext || "");
  const [address, setAddress] = useState(content.address || "");
  const [phone, setPhone] = useState(content.phone || "");
  const [email, setEmail] = useState(content.email || "");
  const [workHours, setWorkHours] = useState(content.work_hours || "");
  const [mapUrl, setMapUrl] = useState(content.map_url || "");

  const handleSave = () => {
    onSave({
      id: page.id,
      title,
      subtitle,
      content: {
        story,
        features,
        team,
        store_image: storeImage,
        badge_text: badgeText,
        badge_subtext: badgeSubtext,
        address,
        phone,
        email,
        work_hours: workHours,
        map_url: mapUrl,
      },
    });
  };

  // Story paragraphs
  const updateStory = (index: number, value: string) => {
    const updated = [...story];
    updated[index] = value;
    setStory(updated);
  };

  const addStoryParagraph = () => {
    setStory([...story, ""]);
  };

  const removeStoryParagraph = (index: number) => {
    setStory(story.filter((_, i) => i !== index));
  };

  // Features
  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const addFeature = () => {
    setFeatures([...features, { icon: "Award", title: "", description: "" }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_: any, i: number) => i !== index));
  };

  // Team
  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = [...team];
    updated[index] = { ...updated[index], [field]: value };
    setTeam(updated);
  };

  const addTeamMember = () => {
    setTeam([...team, { name: "", role: "", description: "", avatar: "" }]);
  };

  const removeTeamMember = (index: number) => {
    setTeam(team.filter((_: any, i: number) => i !== index));
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

      {/* Story */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">История компании (параграфы)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {story.map((paragraph: string, index: number) => (
            <div key={index} className="flex gap-2 items-start">
              <Textarea
                value={paragraph}
                onChange={(e) => updateStory(index, e.target.value)}
                placeholder={`Параграф ${index + 1}`}
                className="min-h-[80px]"
              />
              <Button variant="ghost" size="icon" onClick={() => removeStoryParagraph(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addStoryParagraph}>
            <Plus className="h-4 w-4 mr-1" /> Добавить параграф
          </Button>
        </CardContent>
      </Card>

      {/* Store image & badge */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Изображение магазина</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>URL изображения</Label>
            <Input value={storeImage} onChange={(e) => setStoreImage(e.target.value)} placeholder="https://..." />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Текст бейджа</Label>
              <Input value={badgeText} onChange={(e) => setBadgeText(e.target.value)} placeholder="Лучший магазин" />
            </div>
            <div>
              <Label>Подтекст бейджа</Label>
              <Input value={badgeSubtext} onChange={(e) => setBadgeSubtext(e.target.value)} placeholder="Уссурийск 2023" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Преимущества</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {features.map((feature: any, index: number) => (
            <Card key={index} className="p-4 bg-muted/50">
              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <Select value={feature.icon} onValueChange={(v) => updateFeature(index, "icon", v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Заголовок"
                    value={feature.title}
                    onChange={(e) => updateFeature(index, "title", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Input
                  placeholder="Описание"
                  value={feature.description}
                  onChange={(e) => updateFeature(index, "description", e.target.value)}
                />
              </div>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={addFeature}>
            <Plus className="h-4 w-4 mr-1" /> Добавить преимущество
          </Button>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Команда</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {team.map((member: any, index: number) => (
            <Card key={index} className="p-4 bg-muted/50">
              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Имя"
                    value={member.name}
                    onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Должность"
                    value={member.role}
                    onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeTeamMember(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Input
                  placeholder="Описание"
                  value={member.description}
                  onChange={(e) => updateTeamMember(index, "description", e.target.value)}
                />
                <Input
                  placeholder="URL аватара (опционально)"
                  value={member.avatar || ""}
                  onChange={(e) => updateTeamMember(index, "avatar", e.target.value)}
                />
              </div>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={addTeamMember}>
            <Plus className="h-4 w-4 mr-1" /> Добавить сотрудника
          </Button>
        </CardContent>
      </Card>

      {/* Contact info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Контактная информация</CardTitle>
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
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Часы работы</Label>
              <Input value={workHours} onChange={(e) => setWorkHours(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>URL виджета карты (Яндекс)</Label>
            <Input value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} placeholder="https://yandex.ru/map-widget/..." />
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

// ============ CONTACTS EDITOR ============
function ContactsEditor({ page, onSave, isSaving }: { page: PageContent; onSave: (data: Partial<PageContent> & { id: string }) => void; isSaving: boolean }) {
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
            <div>
              <Label>Instagram</Label>
              <Input
                value={social.instagram || ""}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </div>
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

// ============ MAIN COMPONENT ============
export default function AdminPages() {
  const { data: pages, isLoading } = useAllPageContent();
  const { mutate: updatePage, isPending: isSaving } = useUpdatePageContent();
  const [activeTab, setActiveTab] = useState("warranty");

  const handleSave = (data: Partial<PageContent> & { id: string }) => {
    updatePage(data);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Страницы">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  const pageMap: Record<string, PageContent | undefined> = {};
  pages?.forEach((p) => {
    pageMap[p.page_key] = p;
  });

  const getEditor = (pageKey: string) => {
    const page = pageMap[pageKey];
    if (!page) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p>Страница "{PAGE_LABELS[pageKey]}" ещё не создана в базе данных.</p>
          <p className="text-sm mt-2">Данные будут загружены после первого сохранения.</p>
        </div>
      );
    }

    switch (pageKey) {
      case "warranty":
        return <WarrantyEditor page={page} onSave={handleSave} isSaving={isSaving} />;
      case "delivery":
        return <DeliveryEditor page={page} onSave={handleSave} isSaving={isSaving} />;
      case "about":
        return <AboutEditor page={page} onSave={handleSave} isSaving={isSaving} />;
      case "contacts":
        return <ContactsEditor page={page} onSave={handleSave} isSaving={isSaving} />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout title="Страницы" subtitle="Редактируйте контент статических страниц сайта">
      <div className="space-y-6">

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            {Object.entries(PAGE_LABELS).map(([key, label]) => {
              const Icon = PAGE_ICONS[key];
              return (
                <TabsTrigger key={key} value={key} className="gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(PAGE_LABELS).map((key) => (
            <TabsContent key={key} value={key} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const Icon = PAGE_ICONS[key];
                      return <Icon className="h-5 w-5" />;
                    })()}
                    {PAGE_LABELS[key]}
                  </CardTitle>
                </CardHeader>
                <CardContent>{getEditor(key)}</CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
