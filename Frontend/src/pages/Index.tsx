
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, Settings, Store, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <>
    <div className="h-screen bg-gray-900  ">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Store className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-white">Retail Navigation System</h1>
          </div>
          <p className="text-xl max-w-2xl mx-auto text-white">
            Modern indoor navigation solution for retail stores. Find products efficiently or manage your store layout with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200 bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Navigation className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-white">Customer Navigation</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your shopping list and get optimized routes through the store
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-400 mb-6 space-y-2">
                <li>• Smart route optimization</li>
                <li>• Real-time navigation</li>
                <li>• Multi-floor support</li>
              </ul>
              <Link to="/navigate">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-200 bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-white">Store Management</CardTitle>
              <CardDescription className="text-gray-400">
                Design and manage your store layout with our interactive editor
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-400 mb-6 space-y-2">
                <li>• Interactive layout editor</li>
                <li>• Product placement management</li>
                <li>• Path optimization tools</li>
                <li>• Export/import layouts</li>
              </ul>
              <Link to="/admin">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Manage Store
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
    </>
    
  );
};

export default Index;