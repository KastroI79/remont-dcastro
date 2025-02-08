
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function RemontDCastro() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [style, setStyle] = useState("modern");
  const [purchase, setPurchase] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleGenerateDesign = async () => {
    setLoading(true);
    setTimeout(() => {
      setGeneratedImage(`/placeholder-ai-design-${style}.jpg`);
      setLoading(false);
    }, 3000);
  };

  const handlePurchase = async () => {
    try {
      setErrorMessage(null);
      const response = await fetch("/api/epay-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 20, description: "3D Визуализация" }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("Невалиден отговор от платежната система.");
      }
    } catch (error) {
      console.error("Payment Error: ", error);
      setErrorMessage("Възникна грешка при обработката на плащането. Моля, опитайте отново.");
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Remont D'Castro – AI 3D Визуализации</h1>
      <Card className="p-6 w-full max-w-lg text-center">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Качи снимка на стаята си</h2>
          <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
          {image && (
            <img src={image} alt="Uploaded" className="w-full h-60 object-cover rounded-lg mb-4" />
          )}
          <Select onChange={(e) => setStyle(e.target.value)} value={style} className="mb-4">
            <option value="modern">Модерен</option>
            <option value="classic">Класически</option>
            <option value="industrial">Индустриален</option>
          </Select>
          <Button onClick={handleGenerateDesign} disabled={!image || loading}>
            {loading ? "Генериране..." : "Генерирай 3D дизайн"}
          </Button>
          {generatedImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
              <h2 className="text-xl font-semibold">Генериран дизайн ({style})</h2>
              <img src={generatedImage} alt="Generated" className="w-full h-60 object-cover rounded-lg mt-4" />
              {!purchase ? (
                <Button onClick={handlePurchase} className="mt-4">Купи пълния дизайн чрез ePay.bg</Button>
              ) : (
                <p className="text-green-600 mt-4">Благодарим за покупката! Достъпът до пълния дизайн е активиран.</p>
              )}
              {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
