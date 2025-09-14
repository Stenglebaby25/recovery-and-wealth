import { Instagram, Twitter, Youtube, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialSection = () => {
  const socialLinks = [
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@sobermoneymindset?si=ZA1FzPFe0g4CIDbB", handle: "@sobermoneymindset" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/sobermoneymindset?igsh=ZHFldWhqb3ljaDI3", handle: "@sobermoneymindset" },
    { name: "Twitter", icon: Twitter, href: "https://x.com/SoberMoneyMind?s=09", handle: "@SoberMoneyMind" },
    { name: "TikTok", icon: Music, href: "https://www.tiktok.com/@sobermoneymindset?_t=ZP-8zi2CxGFwCc&_r=1", handle: "@sobermoneymindset" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Connect with Sober Money Mindset
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow our social channels for daily inspiration, financial tips, and recovery success stories from our community.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <Button
                key={social.name}
                variant="outline"
                size="lg"
                className="flex items-center space-x-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                asChild
              >
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  <IconComponent className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{social.name}</div>
                    <div className="text-sm opacity-75">{social.handle}</div>
                  </div>
                </a>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Building wealth through recovery, one mindful step at a time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;