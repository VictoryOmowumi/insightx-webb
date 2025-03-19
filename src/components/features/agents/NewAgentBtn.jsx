import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { CircleFadingPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { registerAgent, getRegions } from "@/services/api";

const NewAgentBtn = ({ onAgentCreated }) => {
    const [regions, setRegions] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [region, setRegion] = useState("");
    const [address, setAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const data = await getRegions();
                setRegions(data);
            } catch (error) {
                toast.error("Failed to fetch regions: " + error.message);
            }
        };
        fetchRegions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = { name, email, phone, region, address };
            await registerAgent(data);
            setName("");
            setEmail("");
            setPhone("");
            setRegion("");
            setAddress("");
            toast.success("Agent registered successfully");
            setIsDialogOpen(false); // Close the dialog
            if (onAgentCreated) {
                onAgentCreated(); // Call the callback to refresh the agent list
            }
        } catch (error) {
            toast.error("Failed to register agent: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <button className="bg-[#303030] dark:bg-neutral-700 flex items-center font-comfortaa text-white px-4 py-2.5 rounded-full hover:bg-[#202020]">
                    <CircleFadingPlus size={20} strokeWidth={1} className="mr-2" />
                    New Agent
                </button>
            </DialogTrigger>
            <DialogContent
                aria-label="New Agent"
                aria-describedby="Add a new agent"
                className='md:w-1/2  overflow-y-auto max-w-full flex flex-col flex-grow gap-0'>
                <div className="px-4 py-2 border-b">
                    <p className="text-lg font-bold text-accent-foreground">New Agent</p>
                    <p className="text-sm text-muted-foreground">
                        Register a new agent
                    </p>
                </div>
                <div className="bg-white dark:bg-neutral-800/80 rounded-2xl flex flex-col flex-grow items-center justify-center p-5 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="w-full ">
                        <div className="space-y-5">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="region">Region</Label>
                                <Select
                                    value={region}
                                    onValueChange={(value) => setRegion(value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            regions.map((region) => (
                                                <SelectItem key={region.code} value={region.code}>
                                                    {region.description}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>

                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Registering..." : "Register Agent"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
            <Toaster richColors />
        </Dialog>
    );
};

export default NewAgentBtn;